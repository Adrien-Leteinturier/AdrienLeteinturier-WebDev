import nodemailer from "nodemailer";

const validEmail = (value) =>
  typeof value === "string" && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);

export class MailDeliveryError extends Error {
  constructor() {
    super("MAIL_DELIVERY_FAILED");
  }
}

export function createGmailTransport({
  user,
  appPassword,
  to,
  createTransport = nodemailer.createTransport,
}) {
  if (
    !validEmail(user) ||
    !validEmail(to) ||
    typeof appPassword !== "string" ||
    !appPassword.trim()
  ) {
    throw new Error("MAIL_CONFIGURATION_REQUIRED");
  }
  const smtp = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass: appPassword.replace(/\s/g, "") },
    tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
    dnsTimeout: 5000,
    disableFileAccess: true,
    disableUrlAccess: true,
    logger: false,
    debug: false,
  });
  return {
    async send({ id, request }) {
      if (!/^[a-f0-9-]{36}$/.test(id) || !validEmail(request?.email)) {
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
      let result;
      try {
        result = await smtp.sendMail({
          from: { name: "Contact portfolio", address: user },
          to: { address: to },
          envelope: { from: user, to: [to] },
          replyTo: { address: request.email },
          subject: `Nouvelle demande portfolio — ${id}`,
          messageId: `<contact.${id}@${user.split("@")[1]}>`,
          text: fields
            .map(([label, value]) => `${label} : ${value || "Non renseigné"}`)
            .join("\n\n"),
          disableFileAccess: true,
          disableUrlAccess: true,
        });
      } catch {
        // SMTP errors can contain private data: never expose the original error.
        throw new MailDeliveryError();
      }
      if (
        !result?.accepted?.some(
          (address) =>
            typeof address === "string" &&
            address.toLowerCase() === to.toLowerCase(),
        ) ||
        result.rejected?.length
      ) {
        throw new MailDeliveryError();
      }
      // SMTP acceptance is not proof of inbox delivery.
      return { accepted: true };
    },
  };
}
