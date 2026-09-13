import nodemailer from "nodemailer";

export function createContactHandler() {
  const gmailPassword = process.env.GMAIL_PASSWORD;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "adrienleteinturier@gmail.com",
      pass: gmailPassword,
    },
  });

  return async function handler(req, res) {
    const mailOptions = {
      from: "adrienleteinturier@gmail.com",
      to: "adrienleteinturier@gmail.com",
      replyTo: req.body.email,
      subject: "Nouvelle demande de contact — Portfolio",
      text: `
        Bonjour Adrien,

        Une nouvelle demande a été envoyée depuis votre formulaire de contact.

        COORDONNÉES
        Nom : ${req.body.name}
        E-mail : ${req.body.email}
        Entreprise : ${req.body.company || "Non renseignée"}
        Téléphone : ${req.body.phone || "Non renseigné"}

        PROJET
        Type : ${req.body.projectType}
        Délai souhaité : ${req.body.timeline}
        Budget : ${req.body.budget || "À discuter"}
        Site actuel : ${req.body.website || "Non renseigné"}

        DESCRIPTION DU BESOIN
        ${req.body.description}

        Vous pouvez répondre directement à ce message pour contacter cette personne.
            `.trim(),
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  };
}
