import { Resend } from 'resend';

// Keys loaded from Environment Variables for Security
export const RESEND_API_KEY = process.env.RESEND_API_KEY!;

const resend = new Resend(RESEND_API_KEY);

// Staff email to receive alerts
const STAFF_EMAIL = 'shotbykh@gmail.com';

// Sender identity
// 'onboarding@resend.dev' allows sending ONLY to 'shotbykh@gmail.com' until domain verification is complete.
// Once 'dankbud.co.za' is verified in Resend, change this to 'alerts@dankbud.co.za'.
const FROM_EMAIL = 'DankBud Bot <onboarding@resend.dev>'; 

export async function sendStaffNotification(subject: string, htmlContent: string) {
  if (!STAFF_EMAIL) return;

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: STAFF_EMAIL,
      subject: `[DankBud Alert] ${subject}`,
      html: htmlContent,
    });
    console.log(`[EMAIL SENT] To: ${STAFF_EMAIL} | Subject: ${subject} | ID: ${data.data?.id}`);
    return { success: true, id: data.data?.id };
  } catch (error) {
    console.error('[EMAIL FAILED]', error);
    return { success: false, error };
  }
}
