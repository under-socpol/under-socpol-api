import path from "path";
import fs from "fs";
import Mustache from "mustache";
import { fileURLToPath } from "url";

import { transporter } from "../config/nodemailer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function emailVerification(name: string, email: string, verificationUrl: string, webUrl: string) {
  const emailTemplatePath = path.resolve(__dirname, "../dist/helper/email-verification.html");
  const emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");

  await transporter.sendMail({
    from: "UNDER SOCIAL AND POLITIC",
    to: `${email}`,
    subject: "[UNDER SOCIAL AND POLITIC] - Email Verification",
    html: Mustache.render(emailTemplate, { name, email, verificationUrl, webUrl }),
  });
}

export async function newEmailVerification(name: string, email: string, verifyUrl: string, webUrl: string) {
  const emailTemplatePath = path.resolve(__dirname, "../dist/helper/new-email-verification.html");
  const emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");

  await transporter.sendMail({
    from: "UNDER SOCIAL AND POLITIC",
    to: `${email}`,
    subject: "[UNDER SOCIAL AND POLITIC] - New Email Verification",
    html: Mustache.render(emailTemplate, { name, email, verifyUrl, webUrl }),
  });
}

export async function resetPassworVerification(name: string, email: string, resetPasswordUrl: string, webUrl: string) {
  const emailTemplatePath = path.resolve(__dirname, "../dist/helper/reset-password-verification.html");
  const emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");

  await transporter.sendMail({
    from: "UNDER SOCIAL AND POLITIC",
    to: `${email}`,
    subject: "[UNDER SOCIAL AND POLITIC] - Reset Password Verification",
    html: Mustache.render(emailTemplate, { name, resetPasswordUrl, webUrl }),
  });
}
