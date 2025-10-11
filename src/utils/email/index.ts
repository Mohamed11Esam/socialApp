import nodemailer, { Transporter } from "nodemailer";
import { devConfig } from "../../config/env/dev.config";

interface SendMailParams {
  to: string;
  subject: string;
  html: string;
  tags?: string[];
}

export async function sendMail({ to, subject, html }: SendMailParams) {
  let transporter: Transporter | undefined;
  let testAccount: nodemailer.TestAccount | undefined;

  try {
    if (devConfig.EMAIL_USER && devConfig.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // STARTTLS
        auth: {
          user: devConfig.EMAIL_USER,
          pass: devConfig.EMAIL_PASS,
        },
      });
    } else {
      // Fallback to Ethereal test account for development when credentials are missing
      testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.warn(
        "EMAIL_USER/EMAIL_PASS not set — using Ethereal test account for outgoing mail (development only)"
      );
    }

    if (!transporter) throw new Error("No mail transporter available");

    const mailOptions: any = {
      from: `socialApp <${devConfig.EMAIL_USER || (testAccount && testAccount.user)}>`,
      to,
      subject,
      html,
    };

    // If tags are provided, include them as a header so downstream systems (SES/Mailgun/etc.) can consume
    if ((arguments[0] as SendMailParams).tags && (arguments[0] as SendMailParams).tags!.length) {
      mailOptions.headers = {
        ...(mailOptions.headers || {}),
        "X-Tags": (arguments[0] as SendMailParams).tags!.join(","),
      };
    }

    const info = await transporter.sendMail(mailOptions);

    // If using Ethereal, log preview URL and return it for tests
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) {
      console.log("Preview email URL:", preview);
    }

    return { info, preview };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("sendMail error:", err);
    throw err;
  }
}
