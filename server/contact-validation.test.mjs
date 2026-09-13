import assert from "node:assert/strict";
import { mock, test } from "node:test";
import nodemailer from "nodemailer";
import { createContactHandler } from "./contact-core.mjs";

const valid = {
  name: "Prospect Test",
  email: "test@example.com",
  description: "Je souhaite créer un site pour présenter mon activité.",
  projectType: "wordpress",
  timeline: "flexible",
  privacy: true,
  companyFax: "",
};

test("validates requests before calling the mail transport", async (t) => {
  const messages = [];
  const transport = mock.method(nodemailer, "createTransport", () => ({
    sendMail: (message) => messages.push(message),
  }));
  t.after(() => transport.mock.restore());
  const handler = createContactHandler();

  async function request(
    body,
    method = "POST",
    contentType = "application/json",
  ) {
    const res = {
      headers: {},
      setHeader(name, value) {
        this.headers[name] = value;
      },
      status(code) {
        this.code = code;
        return this;
      },
      json(data) {
        this.data = data;
        return this;
      },
    };
    await handler(
      { method, headers: { "content-type": contentType }, body },
      res,
    );
    return res;
  }

  const get = await request(undefined, "GET");
  assert.equal(get.code, 405);
  assert.equal(get.headers.Allow, "POST");
  assert.equal((await request(valid, "POST", "text/plain")).code, 415);

  for (const body of [
    undefined,
    null,
    [],
    "{}",
    {},
    { ...valid, email: "invalid" },
    { ...valid, email: "a@example.com\r\nBcc: other@example.com" },
    { ...valid, description: "short" },
    { ...valid, privacy: false },
    { ...valid, companyFax: "spam" },
    { ...valid, company: {} },
  ]) {
    assert.equal((await request(body)).code, 400);
  }
  assert.equal(messages.length, 0);

  await request(
    { ...valid, name: "  Prospect Test  " },
    "POST",
    "application/json; charset=utf-8",
  );
  assert.equal(messages.length, 1);
  assert.equal(messages[0].replyTo, valid.email);
  assert.match(messages[0].text, /Nom : Prospect Test\n/);
  assert.match(messages[0].text, /Entreprise : Non renseignée/);
});
