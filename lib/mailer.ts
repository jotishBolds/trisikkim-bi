import nodemailer from "nodemailer";

if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
  throw new Error(
    "Missing required environment variables: GMAIL_USER and GMAIL_APP_PASSWORD must be set."
  );
}

export const transporter = nodemailer.createTransport({
  host: "smtp.mgovcloud.in",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendOtpEmail(email: string, otp: string) {
  await transporter.sendMail({
    from: `"TRI Sikkim" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your OTP — TRI Sikkim Contact Form",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8f7fc;border-radius:12px;">
        <div style="text-align:center;margin-bottom:24px;">
          <h2 style="color:#1077A6;font-size:22px;margin:0;">TRI Sikkim</h2>
          <p style="color:#1a1550;opacity:0.5;font-size:13px;margin-top:4px;">Tribal Research and Training Institute</p>
        </div>

        <div style="background:white;border-radius:10px;padding:28px;border:1px solid rgba(16,119,166,0.12);">
          <p style="color:#1a1550;font-size:14px;margin:0 0 16px;">
            You requested an OTP to verify your email for the contact form.
          </p>

          <div style="text-align:center;margin:24px 0;">
            <div style="display:inline-block;background:#1077A6;color:white;font-size:32px;font-weight:bold;letter-spacing:10px;padding:16px 32px;border-radius:10px;">
              ${otp}
            </div>
          </div>

          <p style="color:#1a1550;opacity:0.5;font-size:13px;margin:16px 0 0;text-align:center;">
            This OTP expires in <strong>10 minutes</strong>.
            Do not share it with anyone.
          </p>
        </div>

        <p style="color:#1a1550;opacity:0.3;font-size:11px;text-align:center;margin-top:20px;">
          If you did not request this, please ignore this email.
        </p>
      </div>
    `,
  });
}
