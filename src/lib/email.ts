/**
 * Email abstraction service for DailyOfSero
 * Supports Resend when RESEND_API_KEY is configured,
 * with detailed terminal/logger fallback for local dev & testing.
 */

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams): Promise<{ success: boolean; messageId?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "DailyOfSero <noreply@dailyofsero.com>";

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from,
          to,
          subject,
          html,
          text,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return { success: true, messageId: data.id };
      }
      console.warn("Resend email delivery failed, falling back to local log:", await res.text());
    } catch (err) {
      console.error("Resend API error, falling back to console log:", err);
    }
  }

  // Development Fallback Logger
  console.log("\n================ [EMAIL SERVICE (DEV MODE)] ================");
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log("-----------------------------------------------------------");
  console.log(text || html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  console.log("============================================================\n");

  return { success: true, messageId: `dev-mock-${Date.now()}` };
}

/**
 * Helper to send email verification link
 */
export async function sendVerificationEmail(to: string, token: string, appUrl: string) {
  const verifyLink = `${appUrl}/verify-email?token=${token}`;
  return sendEmail({
    to,
    subject: "Verifikasi Akun Kamu di DailyOfSero",
    html: `
      <div style="font-family: 'Montserrat', sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #F8FAFC; border-radius: 16px;">
        <h2 style="color: #0284C7;">Hai Sahabat Sero!</h2>
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
          Selamat datang di <strong>DailyOfSero</strong>! Satu langkah lagi untuk mulai perjalanan healing dan journaling kamu.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verifyLink}" style="background: linear-gradient(135deg, #38BDF8, #A855F7); color: white; padding: 14px 28px; border-radius: 9999px; text-decoration: none; font-weight: bold; display: inline-block;">
            Verifikasi Email Saya
          </a>
        </div>
        <p style="color: #64748B; font-size: 14px;">
          Atau salin tautan berikut ke browsermu:<br>
          <a href="${verifyLink}" style="color: #0EA5E9;">${verifyLink}</a>
        </p>
        <p style="color: #94A3B8; font-size: 12px; margin-top: 24px;">
          Tautan ini berlaku selama 24 jam. Jika kamu tidak merasa mendaftar di DailyOfSero, abaikan email ini ya.
        </p>
      </div>
    `,
  });
}

/**
 * Helper to send password reset link
 */
export async function sendPasswordResetEmail(to: string, token: string, appUrl: string) {
  const resetLink = `${appUrl}/reset-password?token=${token}`;
  return sendEmail({
    to,
    subject: "Permintaan Reset Password — DailyOfSero",
    html: `
      <div style="font-family: 'Montserrat', sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #F8FAFC; border-radius: 16px;">
        <h2 style="color: #9333EA;">Reset Password Akun</h2>
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
          Kami menerima permintaan untuk mengatur ulang kata sandi akunmu di <strong>DailyOfSero</strong>.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetLink}" style="background: #A855F7; color: white; padding: 14px 28px; border-radius: 9999px; text-decoration: none; font-weight: bold; display: inline-block;">
            Buat Password Baru
          </a>
        </div>
        <p style="color: #64748B; font-size: 14px;">
          Tautan ini berlaku selama 1 jam:<br>
          <a href="${resetLink}" style="color: #A855F7;">${resetLink}</a>
        </p>
        <p style="color: #94A3B8; font-size: 12px; margin-top: 24px;">
          Jika kamu tidak meminta reset password, akunmu tetap aman dan abaikan email ini.
        </p>
      </div>
    `,
  });
}

/**
 * Helper to send Takedown Notification email to BA
 */
export async function sendTakedownEmail(to: string, karyaTitle: string, reason?: string) {
  return sendEmail({
    to,
    subject: `Pemberitahuan Takedown Karya: "${karyaTitle}"`,
    html: `
      <div style="font-family: 'Montserrat', sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #FFF1F2; border-radius: 16px; border: 1px solid #FECDD3;">
        <h2 style="color: #E11D48;">Pemberitahuan Takedown Karya</h2>
        <p style="color: #334155; font-size: 15px; line-height: 1.6;">
          Halo, kami ingin memberitahukan bahwa karya kamu dengan judul <strong>"${karyaTitle}"</strong> telah di-takedown (dihapus) oleh Superadmin.
        </p>
        ${
          reason
            ? `<div style="background: white; border-left: 4px solid #E11D48; padding: 12px 16px; margin: 16px 0; border-radius: 8px;">
                <strong>Alasan dari Superadmin:</strong><br>
                <span style="color: #475569;">${reason}</span>
              </div>`
            : ""
        }
        <p style="color: #64748B; font-size: 13px;">
          Waktu: ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })} WIB
        </p>
        <p style="color: #94A3B8; font-size: 12px; margin-top: 20px;">
          Hubungi Mind Captain atau Superadmin jika kamu memerlukan informasi lebih lanjut.
        </p>
      </div>
    `,
  });
}
