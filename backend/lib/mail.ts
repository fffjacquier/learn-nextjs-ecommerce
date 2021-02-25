import { createTransport, getTestMessageUrl } from 'nodemailer';

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function makeNiceEmail(text: string): string {
  return `
    <div style="border: 1px solid black;
      padding: 20px;
      font-family: sans-serif;
      font-size: 22px;
      line-height: 2;
    ">
      <h2>Hello</h2>
      <p>${text}</p>
      <p>😘, Me</p>
    </div>
  `;
}

export interface Envelope {
  from: string;
  to?: string[] | null;
}
export interface MailResponse {
  accepted?: string[] | null;
  rejected?: null[] | null;
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: Envelope;
  messageId: string;
}

export async function sendPasswordResetEmail(
  resetToken: string,
  to: string
): Promise<void> {
  const info = (await transport.sendMail({
    to,
    from: 'fjacquier@gmail.com',
    subject: 'Your password reset token',
    html: makeNiceEmail(`Your password reset token link is here!

      <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click here to reset your password</a>
    `),
  })) as MailResponse;
  if (process.env.MAIL_USER.includes('ethereal.email')) {
    console.log(`Message sent! Preview it at ${getTestMessageUrl(info)}`);
  }
}
