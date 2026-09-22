import nodemailer from "nodemailer";

export interface SendApplicationEmailParams {
  applicationNumber: string;
  fullName: string;
  recipientEmail: string;
  phone?: string;
  pathwayName: string;
  primaryProgramName: string;
  secondaryProgramName?: string;
  schoolOrigin?: string;
}

export interface SendEmailResult {
  success: boolean;
  mocked?: boolean;
  messageId?: string;
  error?: string;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE !== undefined
    ? process.env.SMTP_SECURE === "true"
    : port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

function generateHtmlContent(params: SendApplicationEmailParams): string {
  const {
    applicationNumber,
    fullName,
    pathwayName,
    primaryProgramName,
    secondaryProgramName,
    schoolOrigin,
  } = params;

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Konfirmasi Pendaftaran PMB UNIPDU</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f5f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e2922; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f5f4; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(6, 26, 18, 0.08); border: 1px solid #e5e7eb;">

          <!-- Header Banner -->
          <tr>
            <td style="background-color: #062817; padding: 32px 24px; text-align: center; border-bottom: 4px solid #d4af37;">
              <p style="margin: 0; color: #fef08a; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">Penerimaan Mahasiswa Baru</p>
              <h1 style="margin: 8px 0 0 0; color: #ffffff; font-size: 24px; font-family: Georgia, Cambria, serif; font-weight: 600;">UNIPDU JOMBANG</h1>
              <p style="margin: 6px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 13px;">Universitas Pesantren Tinggi Darul 'Ulum</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 24px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.5; color: #064e3b; font-weight: 600;">
                Assalamu'alaikum Wr. Wb.,
              </p>
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #374151;">
                Yth. <strong style="color: #111827;">${escapeHtml(fullName)}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #374151;">
                Terima kasih telah mendaftar di Universitas Pesantren Tinggi Darul 'Ulum (UNIPDU). Formulir pendaftaran Anda telah berhasil kami terima dalam sistem.
              </p>

              <!-- Application Number Highlight Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f0fdf4; border: 2px dashed #059669; border-radius: 16px; margin: 0 0 28px 0; text-align: center;">
                <tr>
                  <td style="padding: 24px 16px;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; color: #065f46; text-transform: uppercase; letter-spacing: 1.5px;">Nomor Pendaftaran Resmi Anda</p>
                    <div style="font-size: 32px; font-family: Georgia, Cambria, monospace, serif; font-weight: 700; color: #064e3b; letter-spacing: 2px; padding: 4px 0;">
                      ${escapeHtml(applicationNumber)}
                    </div>
                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #047857;">
                      Simpan nomor ini untuk verifikasi, konfirmasi pembayaran, & pengecekan berkas.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Registration Summary Table -->
              <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #064e3b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Ringkasan Pendaftaran</h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 28px 0; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px 16px; font-size: 13px; color: #6b7280; font-weight: 600; width: 40%; border-bottom: 1px solid #e5e7eb;">Jalur Seleksi</td>
                  <td style="padding: 12px 16px; font-size: 14px; color: #111827; font-weight: 600; border-bottom: 1px solid #e5e7eb;">${escapeHtml(pathwayName)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-size: 13px; color: #6b7280; font-weight: 600; border-bottom: 1px solid #e5e7eb;">Pilihan Prodi 1</td>
                  <td style="padding: 12px 16px; font-size: 14px; color: #064e3b; font-weight: 600; border-bottom: 1px solid #e5e7eb;">${escapeHtml(primaryProgramName)}</td>
                </tr>
                ${secondaryProgramName ? `
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px 16px; font-size: 13px; color: #6b7280; font-weight: 600; border-bottom: 1px solid #e5e7eb;">Pilihan Prodi 2</td>
                  <td style="padding: 12px 16px; font-size: 14px; color: #111827; border-bottom: 1px solid #e5e7eb;">${escapeHtml(secondaryProgramName)}</td>
                </tr>` : ""}
                ${schoolOrigin ? `
                <tr>
                  <td style="padding: 12px 16px; font-size: 13px; color: #6b7280; font-weight: 600;">Asal Sekolah</td>
                  <td style="padding: 12px 16px; font-size: 14px; color: #111827;">${escapeHtml(schoolOrigin)}</td>
                </tr>` : ""}
              </table>

              <!-- Next Steps Notice -->
              <div style="background-color: #fefce8; border-left: 4px solid #eab308; border-radius: 8px; padding: 16px; margin: 0 0 28px 0;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #854d0e; font-weight: 700;">Tahapan Selanjutnya:</h4>
                <ol style="margin: 0; padding-left: 20px; font-size: 13px; color: #713f12; line-height: 1.6;">
                  <li style="margin-bottom: 4px;">Tim PMB UNIPDU akan menghubungi Anda melalui WhatsApp atau email untuk verifikasi kelengkapan berkas.</li>
                  <li style="margin-bottom: 4px;">Pastikan nomor WhatsApp yang Anda daftarkan selalu aktif.</li>
                  <li>Jika ada pertanyaan mengenai jalur atau berkas, silakan langsung menghubungi kontak resmi PMB di bawah ini.</li>
                </ol>
              </div>

              <!-- Contact Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="text-align: center; margin: 0 0 24px 0;">
                <tr>
                  <td align="center">
                    <a href="https://wa.me/62895804182000" target="_blank" style="display: inline-block; background-color: #064e3b; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 14px 28px; border-radius: 12px; box-shadow: 0 2px 8px rgba(6, 78, 59, 0.3);">
                      Hubungi PMB via WhatsApp (0895 8041 82000)
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #6b7280;">
                Wassalamu'alaikum Wr. Wb.<br>
                <strong style="color: #111827;">Panitia Penerimaan Mahasiswa Baru UNIPDU</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; line-height: 1.6;">
              <p style="margin: 0 0 4px 0; font-weight: 600; color: #6b7280;">
                Universitas Pesantren Tinggi Darul 'Ulum (UNIPDU)
              </p>
              <p style="margin: 0 0 8px 0;">
                Kompleks Pondok Pesantren Darul 'Ulum Peterongan, Jombang, Jawa Timur 61481
              </p>
              <p style="margin: 0; font-size: 11px;">
                Email ini dikirim secara otomatis sebagai tanda bukti penerimaan pendaftaran calon mahasiswa baru.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function generatePlainTextContent(params: SendApplicationEmailParams): string {
  const {
    applicationNumber,
    fullName,
    pathwayName,
    primaryProgramName,
    secondaryProgramName,
    schoolOrigin,
  } = params;

  return `Assalamu'alaikum Wr. Wb.

Yth. ${fullName},

Terima kasih telah mendaftar di Universitas Pesantren Tinggi Darul 'Ulum (UNIPDU).
Formulir pendaftaran Anda telah berhasil kami terima.

==================================================
NOMOR PENDAFTARAN RESMI ANDA:
${applicationNumber}
==================================================

Detail Pendaftaran:
- Jalur Seleksi     : ${pathwayName}
- Pilihan Prodi 1   : ${primaryProgramName}
${secondaryProgramName ? `- Pilihan Prodi 2   : ${secondaryProgramName}\n` : ""}- Asal Sekolah      : ${schoolOrigin || "-"}

Tahapan Selanjutnya:
1. Simpan nomor pendaftaran ini sebagai bukti pendaftaran resmi.
2. Tim PMB UNIPDU akan menghubungi Anda melalui WhatsApp/email untuk verifikasi data & berkas.
3. Hubungi layanan resmi PMB jika ada pertanyaan:
   - WhatsApp : 0895 8041 82000 (https://wa.me/62895804182000)
   - Email    : pmb@unipdu.ac.id
   - Alamat   : Kompleks PP. Darul 'Ulum Peterongan, Jombang, Jawa Timur 61481

Wassalamu'alaikum Wr. Wb.
Panitia PMB UNIPDU
`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendApplicationConfirmationEmail(
  params: SendApplicationEmailParams
): Promise<SendEmailResult> {
  const { applicationNumber, recipientEmail, fullName } = params;

  try {
    const transporter = getTransporter();

    // Dev Fallback / Mock Mode when SMTP credentials are not yet configured
    if (!transporter) {
      console.log(
        `[EMAIL_DEV_MOCK] Confirmation email prepared for: ${fullName} <${recipientEmail}> | No. Pendaftaran: ${applicationNumber}`
      );
      console.log(
        `[EMAIL_DEV_MOCK] To deliver live emails, configure SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.local`
      );
      return {
        success: true,
        mocked: true,
        messageId: `mock-${Date.now()}-${applicationNumber}`,
      };
    }

    const fromAddress =
      process.env.EMAIL_FROM || '"PMB UNIPDU" <pmb@unipdu.ac.id>';
    const subject = `Konfirmasi Pendaftaran PMB UNIPDU - ${applicationNumber} (${fullName})`;

    const info = await transporter.sendMail({
      from: fromAddress,
      to: recipientEmail,
      subject,
      text: generatePlainTextContent(params),
      html: generateHtmlContent(params),
    });

    console.log(
      `[EMAIL_SENT] Confirmation email sent successfully to ${recipientEmail} (ID: ${info.messageId})`
    );

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal mengirim email konfirmasi";
    console.error(
      `[EMAIL_ERROR] Failed to send confirmation email to ${recipientEmail} for ${applicationNumber}:`,
      errorMessage
    );
    return {
      success: false,
      error: errorMessage,
    };
  }
}
