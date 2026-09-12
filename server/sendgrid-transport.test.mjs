import test from "node:test";
import assert from "node:assert/strict";
import {
  createSendgridTransport,
  MailDeliveryError,
} from "./sendgrid-transport.mjs";

const config = {
  apiKey: "test-key-not-a-secret",
  from: "sender@example.com",
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
  },
};

test("trusted sender/recipient cannot be replaced by visitor fields", async () => {
  const transport = createSendgridTransport({
    ...config,
    fetchImpl: async (url, options) => {
      assert.equal(url, "https://api.sendgrid.com/v3/mail/send");
      const body = JSON.parse(options.body);
      assert.equal(body.from.email, config.from);
      assert.equal(body.personalizations[0].to[0].email, config.to);
      assert.equal(body.reply_to.email, message.request.email);
      assert.equal(body.content[0].type, "text/plain");
      assert.ok(body.content[0].value.includes(message.request.description));
      assert.equal(body.custom_args.contact_request_id, message.id);
      assert.equal(body.tracking_settings.open_tracking.enable, false);
      assert.ok(options.signal instanceof AbortSignal);
      return { status: 202 };
    },
  });
  assert.deepEqual(await transport.send(message), { accepted: true });
});

test("provider rejection and network error never claim acceptance or expose details", async () => {
  for (const status of [200, 400, 401, 403, 429, 500]) {
    const transport = createSendgridTransport({
      ...config,
      fetchImpl: async () => ({ status }),
    });
    await assert.rejects(
      transport.send(message),
      (error) => error instanceof MailDeliveryError && error.status === status,
    );
  }
  const transport = createSendgridTransport({
    ...config,
    fetchImpl: async () => {
      throw new Error("private provider detail");
    },
  });
  await assert.rejects(
    transport.send(message),
    (error) => error.message === "MAIL_DELIVERY_FAILED" && !error.cause,
  );
});

test("missing configuration and header injection fail before a request is sent", async () => {
  assert.throws(() => createSendgridTransport({ ...config, apiKey: "" }));
  assert.throws(() =>
    createSendgridTransport({
      ...config,
      to: "x@example.com\r\nBcc:y@example.com",
    }),
  );
  let calls = 0;
  const transport = createSendgridTransport({
    ...config,
    fetchImpl: async () => {
      calls++;
    },
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
