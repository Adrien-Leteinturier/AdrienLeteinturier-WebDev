import test from "node:test";
import assert from "node:assert/strict";
import nodemailer from "nodemailer";
import { createGmailTransport, MailDeliveryError } from "./gmail-transport.mjs";

const config = {
  user: "sender@example.com",
  appPassword: "test password not real",
  to: "owner@example.com",
};
const message = {
  id: "12345678-1234-1234-1234-123456789abc",
  request: {
    name: "Test identifié",
    email: "visitor@example.com",
    description: "<script>Un contenu doit rester du texte.</script>",
    to: "attacker@example.com",
    from: "attacker@example.com",
    attachments: [{ path: "/private-file" }],
  },
};

test("Gmail TLS configuration and envelope use only server-owned addresses", async () => {
  const transport = createGmailTransport({
    ...config,
    createTransport: (options) => {
      assert.equal(options.host, "smtp.gmail.com");
      assert.equal(options.port, 465);
      assert.equal(options.secure, true);
      assert.equal(options.tls.rejectUnauthorized, true);
      assert.equal(options.disableFileAccess, true);
      assert.equal(options.disableUrlAccess, true);
      assert.equal(options.logger, false);
      return {
        sendMail: async (mail) => {
          assert.deepEqual(mail.envelope, {
            from: config.user,
            to: [config.to],
          });
          assert.equal(mail.replyTo.address, message.request.email);
          assert.equal(mail.from.address, config.user);
          assert.equal(mail.to.address, config.to);
          assert.ok(mail.text.includes(message.request.description));
          assert.equal(mail.html, undefined);
          assert.equal(mail.attachments, undefined);
          return { accepted: [config.to], rejected: [] };
        },
      };
    },
  });
  assert.deepEqual(await transport.send(message), { accepted: true });
});

test("Nodemailer composes a real message without network, file or extra recipient access", async () => {
  let generated;
  const composer = nodemailer.createTransport({
    streamTransport: true,
    buffer: true,
  });
  const transport = createGmailTransport({
    ...config,
    createTransport: () => ({
      sendMail: async (mail) => {
        generated = await composer.sendMail(mail);
        return { accepted: [config.to], rejected: [] };
      },
    }),
  });
  await transport.send(message);
  const raw = generated.message.toString();
  assert.match(raw, /Reply-To: visitor@example.com/);
  assert.match(raw, /Content-Type: text\/plain/);
  assert.ok(!raw.includes("attacker@example.com"));
  assert.ok(!raw.includes("/private-file"));
  assert.deepEqual(generated.envelope.to, [config.to]);
});

test("SMTP rejection and errors cannot claim success or expose private diagnostics", async () => {
  for (const result of [
    {},
    { accepted: [] },
    { accepted: ["wrong@example.com"] },
    { accepted: [config.to], rejected: [config.to] },
  ]) {
    const transport = createGmailTransport({
      ...config,
      createTransport: () => ({ sendMail: async () => result }),
    });
    await assert.rejects(transport.send(message), MailDeliveryError);
  }
  const transport = createGmailTransport({
    ...config,
    createTransport: () => ({
      sendMail: async () => {
        throw new Error("private diagnostic");
      },
    }),
  });
  await assert.rejects(
    transport.send(message),
    (error) => error.message === "MAIL_DELIVERY_FAILED" && !error.cause,
  );
});

test("invalid configuration and header injection fail before SMTP", async () => {
  assert.throws(() => createGmailTransport({ ...config, appPassword: "" }));
  assert.throws(() =>
    createGmailTransport({
      ...config,
      to: "x@example.com\r\nBcc:y@example.com",
    }),
  );
  let calls = 0;
  const transport = createGmailTransport({
    ...config,
    createTransport: () => ({
      sendMail: async () => {
        calls++;
      },
    }),
  });
  await assert.rejects(
    transport.send({
      ...message,
      request: { email: "x@example.com\nBcc:y@example.com" },
    }),
  );
  await assert.rejects(transport.send({ ...message, id: "injected\nsubject" }));
  assert.equal(calls, 0);
});
