const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

export class MailDeliveryError extends Error {
  constructor(status = 0) {
    super("MAIL_DELIVERY_FAILED");
    this.status = status;
  }
}

// Sender and recipient come only from trusted server configuration.
export function createSendgridTransport({
  apiKey,
  from,
  to,
  fetchImpl = fetch,
}) {
  if (
    typeof apiKey !== "string" ||
    !apiKey.trim() ||
    ![from, to].every(
      (value) => typeof value === "string" && emailPattern.test(value),
    )
  ) {
    throw new Error("MAIL_CONFIGURATION_REQUIRED");
  }
  return {
    async send({ id, request }) {
      if (
        !/^[a-f0-9-]{36}$/.test(id) ||
        typeof request?.email !== "string" ||
        !emailPattern.test(request.email)
      ) {
        throw new Error("INVALID_MAIL_REQUEST");
      }
      const fields = [
        ["Référence", id],
        ["Nom", request.name],
        ["Email", request.email],
        ["Entreprise", request.company],
        ["Téléphone", request.phone],
        ["Projet", request.projectType],
        ["Échéance", request.timeline],
        ["Budget", request.budget],
        ["Site", request.website],
        ["Description", request.description],
      ];
      let response;
      try {
        response = await fetchImpl("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(8000),
          body: JSON.stringify({
            personalizations: [{ to: [{ email: to }] }],
            from: { email: from, name: "Contact portfolio" },
            reply_to: { email: request.email },
            subject: `Nouvelle demande portfolio — ${id}`,
            content: [
              {
                type: "text/plain",
                value: fields
                  .map(
                    ([label, value]) =>
                      `${label} : ${value || "Non renseigné"}`,
                  )
                  .join("\n\n"),
              },
            ],
            custom_args: { contact_request_id: id },
            tracking_settings: {
              click_tracking: { enable: false, enable_text: false },
              open_tracking: { enable: false },
            },
          }),
        });
      } catch {
        // Never propagate provider errors containing credentials or request data.
        throw new MailDeliveryError();
      }
      if (response.status !== 202) throw new MailDeliveryError(response.status);
      // This means accepted by SendGrid, not delivered to the inbox.
      return { accepted: true };
    },
  };
}
