import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export class ContactError extends Error {
  constructor(status, code) {
    super(code);
    this.status = status;
    this.code = code;
  }
}
const fail = (status, code) => {
  throw new ContactError(status, code);
};
const types = new Set([
  "wordpress",
  "custom",
  "business-tool",
  "redesign",
  "advice",
]);
const timelines = new Set(["soon", "1-3-months", "3-6-months", "flexible"]);
const budgets = new Set([
  "",
  "under-1500",
  "1500-3000",
  "3000-6000",
  "over-6000",
]);
export function validateRequest(value) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    fail(400, "INVALID_REQUEST");
  const text = (key, max, min = 0, multiline = false) => {
    if (typeof value[key] !== "string") fail(400, "INVALID_REQUEST");
    const input = value[key].trim();
    if (
      input.length < min ||
      input.length > max ||
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(input) ||
      (!multiline && /[\r\n]/.test(input))
    )
      fail(400, "INVALID_REQUEST");
    return input;
  };
  if (value.companyFax !== "" || value.privacy !== true)
    fail(400, "INVALID_REQUEST");
  const request = {
    projectType: text("projectType", 30, 1),
    name: text("name", 100, 2),
    email: text("email", 254, 3).toLowerCase(),
    company: text("company", 120),
    phone: text("phone", 30),
    description: text("description", 5000, 30, true),
    timeline: text("timeline", 30, 1),
    budget: text("budget", 30),
    website: text("website", 300),
    privacyVersion: "2026-09-09",
  };
  if (
    !types.has(request.projectType) ||
    !timelines.has(request.timeline) ||
    !budgets.has(request.budget)
  )
    fail(400, "INVALID_REQUEST");
  if (
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(request.email) ||
    !/^[+()\d .-]*$/.test(request.phone)
  )
    fail(400, "INVALID_REQUEST");
  if (request.website) {
    try {
      const url = new URL(request.website);
      if (
        !["https:", "http:"].includes(url.protocol) ||
        url.username ||
        url.password
      )
        fail(400, "INVALID_REQUEST");
    } catch {
      fail(400, "INVALID_REQUEST");
    }
  }
  return request;
}
const hmac = (value, secret) =>
  createHmac("sha256", secret).update(value).digest("base64url");
export function issueChallenge(secret, address, now = Date.now()) {
  const payload = Buffer.from(
    JSON.stringify({
      id: randomUUID(),
      time: now,
      client: hmac(address, secret),
    }),
  ).toString("base64url");
  return payload + "." + hmac(payload, secret);
}
export function verifyChallenge(token, secret, address, now = Date.now()) {
  if (typeof token !== "string" || token.length > 1024)
    fail(400, "INVALID_CHALLENGE");
  const parts = token.split(".");
  if (parts.length !== 2) fail(400, "INVALID_CHALLENGE");
  const expected = Buffer.from(hmac(parts[0], secret));
  const actual = Buffer.from(parts[1]);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual))
    fail(400, "INVALID_CHALLENGE");
  let data;
  try {
    data = JSON.parse(Buffer.from(parts[0], "base64url").toString());
  } catch {
    fail(400, "INVALID_CHALLENGE");
  }
  if (
    !data ||
    typeof data.time !== "number" ||
    !/^[a-f0-9-]{36}$/.test(data.id) ||
    data.client !== hmac(address, secret) ||
    now - data.time < 3000 ||
    now - data.time > 3600000
  )
    fail(400, "INVALID_CHALLENGE");
  return data.id;
}

// A repository must atomically deduplicate the id, enforce durable rate limits,
// and persist the request together with its private notification outbox entry.
export function createContactHandler({
  repository,
  secret,
  origins = [],
  now = Date.now,
} = {}) {
  const ready = () =>
    Boolean(
      repository &&
      typeof repository.createRequestAndNotification === "function" &&
      typeof secret === "string" &&
      secret.length >= 32 &&
      origins.length,
    );
  return async function contact(req, res) {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    const send = (status, body) => res.status(status).json(body);
    if (!["GET", "POST"].includes(req.method)) {
      res.setHeader("Allow", "GET, POST");
      return send(405, { error: "METHOD_NOT_ALLOWED" });
    }
    if (!ready())
      return send(req.method === "GET" ? 200 : 503, {
        available: false,
        error: "CONTACT_UNAVAILABLE",
      });
    const origin = req.headers.origin;
    if (origin && !origins.includes(origin))
      return send(403, { error: "ORIGIN_NOT_ALLOWED" });
    if (req.method === "POST" && !origin)
      return send(403, { error: "ORIGIN_NOT_ALLOWED" });
    // Vercel overwrites x-real-ip; never trust a client-supplied x-forwarded-for.
    const address = req.headers["x-real-ip"] || req.socket?.remoteAddress;
    if (typeof address !== "string" || address.length > 100)
      return send(503, { error: "CONTACT_UNAVAILABLE" });
    if (req.method === "GET")
      return send(200, {
        available: true,
        token: issueChallenge(secret, address, now()),
      });
    try {
      if (
        !String(req.headers["content-type"])
          .toLowerCase()
          .startsWith("application/json")
      )
        fail(415, "JSON_REQUIRED");
      const declared = Number(req.headers["content-length"] || 0);
      if (!Number.isFinite(declared) || declared > 16384 || declared < 0)
        fail(413, "REQUEST_TOO_LARGE");
      let body = req.body;
      if (typeof body === "string") {
        if (Buffer.byteLength(body) > 16384) fail(413, "REQUEST_TOO_LARGE");
        try {
          body = JSON.parse(body);
        } catch {
          fail(400, "INVALID_REQUEST");
        }
      }
      if (Buffer.byteLength(JSON.stringify(body) || "") > 16384)
        fail(413, "REQUEST_TOO_LARGE");
      const request = validateRequest(body);
      const id = verifyChallenge(body.token, secret, address, now());
      await repository.createRequestAndNotification({
        id,
        request,
        // Raw network addresses are not persisted.
        clientKey: hmac(address, secret),
        emailKey: hmac(request.email, secret),
        createdAt: now(),
      });
      return send(201, { stored: true, id });
    } catch (error) {
      if (error instanceof ContactError) {
        if (error.status === 429) res.setHeader("Retry-After", "3600");
        return send(error.status, { error: error.code });
      }
      // Never log request data, email addresses or provider credentials.
      console.error("Contact persistence failed");
      return send(503, { error: "CONTACT_UNAVAILABLE" });
    }
  };
}
