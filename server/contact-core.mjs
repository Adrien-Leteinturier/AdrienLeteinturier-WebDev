import nodemailer from "nodemailer";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1).trim(),
  email: z.email({ pattern: z.regexes.html5Email }),
  description: z.string().min(1).trim(),
  projectType: z.string().min(1),
  timeline: z.string().min(1),
  company: z.string().optional(),
  phone: z.string().optional(),
  budget: z.string().optional(),
  website: z.string().optional(),
  privacy: z.literal(true),
  source: z.string().max(200).optional(),
});

export function createContactHandler() {
  const gmailPassword = process.env.GMAIL_APP_PASSWORD;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "adrienleteinturier@gmail.com",
      pass: gmailPassword,
    },
  });

  return async function handler(req, res) {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    }

    const contentType = req.headers?.["content-type"]
      ?.split(";")[0]
      .trim()
      .toLowerCase();
    if (contentType !== "application/json") {
      return res.status(415).json({ error: "JSON_REQUIRED" });
    }

    const result = contactSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "INVALID_CONTACT",
        fields: z.flattenError(result.error).fieldErrors,
      });
    }
    const contact = result.data;

    const mailOptions = {
      from: "adrienleteinturier@gmail.com",
      to: "adrienleteinturier@gmail.com",
      replyTo: contact.email,
      subject: "Nouvelle demande de contact — Portfolio",
      text: `
        Bonjour Adrien,

        Une nouvelle demande a été envoyée depuis votre formulaire de contact.

        COORDONNÉES
        Nom : ${contact.name}
        E-mail : ${contact.email}
        Entreprise : ${contact.company || "Non renseignée"}
        Téléphone : ${contact.phone || "Non renseigné"}

        PROJET
        Type : ${contact.projectType}
        Délai souhaité : ${contact.timeline}
        Budget : ${contact.budget || "À discuter"}
        Site actuel : ${contact.website || "Non renseigné"}
        Source : ${contact.source || "Direct"}

        DESCRIPTION DU BESOIN
        ${contact.description}

        Vous pouvez répondre directement à ce message pour contacter cette personne.
            `.trim(),
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ sent: true });
    } catch (error) {
      console.error("Contact email failed:", error.code);
      return res.status(502).json({ error: "EMAIL_SEND_FAILED" });
    }
  };
}
