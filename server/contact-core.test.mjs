import test from "node:test";
import assert from "node:assert/strict";
import {
  ContactError,
  createContactHandler,
  issueChallenge,
  validateRequest,
  verifyChallenge,
} from "./contact-core.mjs";
const valid = {
  projectType: "wordpress",
  name: "Prospect Test",
  email: "test@example.com",
  company: "",
  phone: "",
  description:
    "Une demande de test clairement identifiable pour un nouveau site.",
  timeline: "flexible",
  budget: "",
  website: "",
  companyFax: "",
  privacy: true,
};
const secret = "test-only-".repeat(6),
  address = "192.0.2.1",
  clock = 100000;
function response() {
  return {
    headers: {},
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(n) {
      this.statusCode = n;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}
function request(body = valid) {
  return {
    method: "POST",
    headers: {
      origin: "https://example.com",
      "content-type": "application/json",
      "x-real-ip": address,
    },
    body: { ...body, token: issueChallenge(secret, address, clock - 5000) },
  };
}
test("validates and only retains allowed fields", () => {
  const r = validateRequest({ ...valid, admin: true });
  assert.equal(r.email, "test@example.com");
  assert.equal(r.admin, undefined);
});
for (const [label, patch] of Object.entries({
  email: { email: "person@example.com\r\nBcc:other@example.com" },
  honeypot: { companyFax: "spam" },
  consent: { privacy: false },
  enum: { projectType: "arbitrary" },
  description: { description: "short" },
  url: { website: "javascript:alert(1)" },
  credentials: { website: "https://user:pass@example.com" },
})) {
  test("rejects " + label, () =>
    assert.throws(() => validateRequest({ ...valid, ...patch }), ContactError),
  );
}
test("challenge rejects tampering, early sends, expiry and a different address", () => {
  const token = issueChallenge(secret, address, clock);
  assert.throws(
    () => verifyChallenge(token + "x", secret, address, clock + 4000),
    ContactError,
  );
  assert.throws(
    () => verifyChallenge(token, secret, address, clock + 1000),
    ContactError,
  );
  assert.throws(
    () => verifyChallenge(token, secret, address, clock + 3600001),
    ContactError,
  );
  assert.throws(
    () => verifyChallenge(token, secret, "192.0.2.2", clock + 4000),
    ContactError,
  );
  assert.ok(verifyChallenge(token, secret, address, clock + 4000));
});
test("unconfigured endpoint stays closed and never claims storage", async () => {
  const handler = createContactHandler(),
    res = response();
  await handler(request(), res);
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.stored, undefined);
  const status = response();
  await handler({ method: "GET" }, status);
  assert.equal(status.body.available, false);
});
test("only confirms after repository has durably accepted request and notification", async () => {
  const writes = [];
  const handler = createContactHandler({
    secret,
    origins: ["https://example.com"],
    now: () => clock,
    repository: {
      async createRequestAndNotification(input) {
        writes.push(input);
      },
    },
  });
  const res = response();
  await handler(request(), res);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.stored, true);
  assert.equal(writes.length, 1);
  assert.equal(writes[0].request.email, valid.email);
  assert.notEqual(writes[0].clientKey, address);
});
test("rejects foreign origins, unsupported content and oversized requests before storage", async () => {
  let count = 0;
  const handler = createContactHandler({
    secret,
    origins: ["https://example.com"],
    now: () => clock,
    repository: {
      async createRequestAndNotification() {
        count++;
      },
    },
  });
  for (const [header, value, code] of [
    ["origin", "https://evil.example", 403],
    ["content-type", "text/plain", 415],
    ["content-length", "99999", 413],
  ]) {
    const req = request();
    req.headers[header] = value;
    const res = response();
    await handler(req, res);
    assert.equal(res.statusCode, code);
  }
  assert.equal(count, 0);
});
test("propagates durable rate limit rejection without success", async () => {
  const handler = createContactHandler({
    secret,
    origins: ["https://example.com"],
    now: () => clock,
    repository: {
      async createRequestAndNotification() {
        throw new ContactError(429, "RATE_LIMITED");
      },
    },
  });
  const res = response();
  await handler(request(), res);
  assert.equal(res.statusCode, 429);
  assert.equal(res.body.stored, undefined);
  assert.equal(res.headers["Retry-After"], "3600");
});
test("does not claim success if storage fails", async () => {
  const handler = createContactHandler({
    secret,
    origins: ["https://example.com"],
    now: () => clock,
    repository: {
      async createRequestAndNotification() {
        throw Error("Unavailable");
      },
    },
  });
  const res = response();
  await handler(request(), res);
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.stored, undefined);
});
