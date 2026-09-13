import assert from "node:assert/strict";
import { mock, test } from "node:test";
import nodemailer from "nodemailer";
import { z } from "zod";
import "@angular/compiler";
import { FormControl, Validators } from "@angular/forms";
import { readFileSync } from "node:fs";
import { createContactHandler } from "./contact-core.mjs";

const valid = {
  name: "Prospect Test",
  email: "test@example.com",
  description: "Je souhaite créer un site pour présenter mon activité.",
  projectType: "wordpress",
  timeline: "flexible",
  privacy: true,
};

test("validates requests before calling the mail transport", async (t) => {
  const messages = [];
  const transport = mock.method(nodemailer, "createTransport", () => ({
    sendMail: async (message) => messages.push(message),
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
    { ...valid, description: "" },
    { ...valid, privacy: false },
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

  // Comparaison avec les vrais validateurs Angular, notamment aux limites.
  const cases = [
    [
      "email",
      [Validators.required, Validators.pattern(z.regexes.html5Email)],
      [
        "test@example.com",
        "test@localhost",
        "o'hara@example.com",
        "a@example.c",
        "a..b@example.com",
        "a@-example.com",
        "",
        "a".repeat(65) + "@example.com",
      ],
    ],
    [
      "name",
      [Validators.required],
      [" A", "A ", "A", "", "A".repeat(100), "A".repeat(101)],
    ],
    [
      "description",
      [Validators.required],
      [
        "x".repeat(29) + " ",
        "x".repeat(29),
        "x".repeat(5000),
        "x".repeat(5001),
      ],
    ],
    ["phone", [], ["", "+33 (0)6 12 34 56 78", "abc", "1".repeat(31)]],
    ["privacy", [Validators.requiredTrue], [true, false, "true"]],
  ];
  for (const [field, validators, values] of cases) {
    for (const value of values) {
      const expected = new FormControl(value, validators).valid;
      const response = await request({ ...valid, [field]: value });
      assert.equal(
        response.code !== 400,
        expected,
        `${field}: ${JSON.stringify(value)}`,
      );
      if (!expected) assert.ok(response.data.fields[field]);
    }
  }

  // Toutes les options réellement proposées dans le template doivent passer.
  const template = readFileSync(
    new URL("../src/app/contact/contact.component.html", import.meta.url),
    "utf8",
  );
  for (const field of ["projectType", "timeline", "budget"]) {
    const select = [
      ...template.matchAll(/<select\b([^>]*)>([\s\S]*?)<\/select>/g),
    ].find((match) => match[1].includes(`formControlName="${field}"`));
    assert.ok(select, field);
    for (const [, value] of select[2].matchAll(/<option value="([^"]*)"/g)) {
      const response = await request({ ...valid, [field]: value });
      assert.equal(
        response.code !== 400,
        value !== "" || field === "budget",
        `${field}: ${value}`,
      );
    }
  }
  const emptyOptionals = await request({
    ...valid,
    company: "",
    phone: "",
    website: "",
    budget: "",
  });
  assert.notEqual(emptyOptionals.code, 400);
  // Les anciens formulaires peuvent encore envoyer ce champ : il est ignore.
  assert.notEqual(
    (await request({ ...valid, companyFax: "autofill" })).code,
    400,
  );
  const invalid = await request({
    ...valid,
    email: "invalid",
    description: "",
  });
  assert.deepEqual(Object.keys(invalid.data.fields).sort(), [
    "description",
    "email",
  ]);
});

test("finishes the HTTP response only after SMTP succeeds or fails", async (t) => {
  for (const succeeds of [true, false]) {
    let resolveMail, rejectMail;
    const mail = new Promise((resolve, reject) => {
      resolveMail = resolve;
      rejectMail = reject;
    });
    const transport = mock.method(nodemailer, "createTransport", () => ({
      sendMail: () => mail,
    }));
    const log = mock.method(console, "error", () => {});
    t.after(() => {
      transport.mock.restore();
      log.mock.restore();
    });
    const handler = createContactHandler();
    const res = {
      status(code) {
        this.code = code;
        return this;
      },
      json(data) {
        this.data = data;
        return this;
      },
    };
    const pending = handler(
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: valid,
      },
      res,
    );
    assert.equal(res.data, undefined);
    if (succeeds) resolveMail({ accepted: ["adrienleteinturier@gmail.com"] });
    else
      rejectMail(Object.assign(new Error("SMTP failure"), { code: "EAUTH" }));
    await pending;
    assert.equal(res.code, succeeds ? 200 : 502);
    assert.deepEqual(
      res.data,
      succeeds ? { sent: true } : { error: "EMAIL_SEND_FAILED" },
    );
    transport.mock.restore();
    log.mock.restore();
  }
});
