import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// FROM: must be a verified sender in Resend dashboard, e.g., 'orders@dankbud.co.za' or 'onboarding@resend.dev' if testing
// For now, I'll use a likely verified domain or a generic one if configured. 
// Assuming the user has a domain set up, otherwise 'onboarding@resend.dev' works for testing to ONLY their email.
const FROM_EMAIL = 'DankBud Orders <orders@dankbud.co.za>';

export const EmailService = {

    async sendPudoConfirmation(
        toEmail: string,
        memberName: string,
        orderId: string,
        pudoDetails: { pin: string; waybill: string; trackingUrl: string; lockerName?: string }
    ) {
        if (!process.env.RESEND_API_KEY) {
            console.warn("⚠️ RESEND_API_KEY missing. Skipping email.");
            return;
        }

        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: toEmail,
                subject: `🔐 Order #${orderId}: PUDO Locker PIN & Tracking`,
                html: `
                <div style="font-family: monospace; background: #000; color: #facc15; padding: 20px;">
                    <h1 style="text-transform: uppercase;">Order Dispatched!</h1>
                    <p>Hi ${memberName},</p>
                    <p>Your stash for <strong>Order #${orderId}</strong> is on its way.</p>
                    
                    <div style="border: 2px solid #facc15; padding: 15px; margin: 20px 0;">
                        <h2 style="margin-top: 0;">🔐 YOUR COLLECTION PIN</h2>
                        <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; background: #facc15; color: #000; display: inline-block; padding: 10px;">
                            ${pudoDetails.pin}
                        </div>
                        <p style="margin-top: 10px;">Locker: <strong>${pudoDetails.lockerName || 'Selected Terminal'}</strong></p>
                        <p>Waybill: ${pudoDetails.waybill}</p>
                    </div>

                    <p>
                        <a href="${pudoDetails.trackingUrl}" style="color: #000; background: #facc15; padding: 10px 20px; text-decoration: none; font-weight: bold; text-transform: uppercase;">
                            Track Package
                        </a>
                    </p>

                    <p style="margin-top: 30px; font-size: 12px; opacity: 0.7;">
                        Enter the PIN above at the PUDO locker touch screen to open the door.<br/>
                        If you chose "To Door" delivery, the driver will contact you.
                    </p>
                </div>
            `
            });
            console.log(`📧 [Email] Sent PUDO details to ${toEmail}`);
        } catch (e) {
            console.error("❌ [Email] Failed to send:", e);
        }
    },

    async sendAdminAlert(
        orderId: string,
        pudoDetails: { pin: string; waybill: string },
        memberName: string
    ) {
        if (!process.env.RESEND_API_KEY) return;

        // Send to Admin (Env or Hardcoded default)
        const adminEmail = process.env.ADMIN_EMAIL || 'shotbykh@gmail.com';

        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: adminEmail,
                subject: `📦 [ADMIN] PUDO Booked for #${orderId}`,
                html: `
                <h1>PUDO Shipment Created</h1>
                <p>Order: <strong>#${orderId}</strong></p>
                <p>Member: ${memberName}</p>
                <p>Waybill: ${pudoDetails.waybill}</p>
                <p>PIN: ${pudoDetails.pin}</p>
                <hr/>
                <p>Drop off the package at your source terminal (Miramar or as configured).</p>
            `
            });
        } catch (e) {
            console.error("❌ [Email-Admin] Failed:", e);
        }
    },

    async sendStaffNotification(
        subject: string,
        message: string
    ) {
        if (!process.env.RESEND_API_KEY) return;

        const adminEmail = process.env.ADMIN_EMAIL || 'shotbykh@gmail.com';

        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: adminEmail,
                subject: `🔔 [STAFF] ${subject}`,
                html: `
                  <div style="font-family: sans-serif; padding: 20px;">
                      <h1>Staff Notification</h1>
                      <p>${message}</p>
                      <hr/>
                      <p style="font-size: 12px; opacity: 0.5;">DankBud Automator</p>
                  </div>
              `
            });
        } catch (e) {
            console.error("❌ [Email-Staff] Failed:", e);
        }
    }

};
