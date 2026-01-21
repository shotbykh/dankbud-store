import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// FROM: must be a verified sender in Resend dashboard
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
    },

    async sendWelcomeEmail(toEmail: string, memberName: string) {
        if (!process.env.RESEND_API_KEY) return;

        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: toEmail,
                subject: `🍄 Welcome to the Club, ${memberName}`,
                html: `
                <div style="background-color: #000000; color: #facc15; font-family: 'Courier New', Courier, monospace; padding: 40px 20px; text-align: center;">
                    
                    <!-- HERO: LOGO / HEADER -->
                    <div style="border: 4px solid #facc15; padding: 20px; display: inline-block; margin-bottom: 30px; box-shadow: 8px 8px 0px 0px #ffffff;">
                        <h1 style="margin: 0; font-size: 36px; text-transform: uppercase; letter-spacing: -2px;">DANKBUD</h1>
                        <p style="margin: 5px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Private Member Club</p>
                    </div>

                    <!-- BODY COPY -->
                    <h2 style="font-size: 24px; text-transform: uppercase; margin-bottom: 20px;">You're In.</h2>
                    
                    <p style="font-size: 16px; line-height: 1.6; max-width: 400px; margin: 0 auto 30px; color: #ffffff;">
                        Welcome to the underground. Your membership has been approved. 
                        You now have access to our curated selection of premium stash at shared member costs.
                    </p>

                    <!-- CTA BUTTON -->
                    <a href="https://dankbud.co.za/shop" style="background-color: #facc15; color: #000000; padding: 15px 30px; font-size: 20px; font-weight: bold; text-decoration: none; text-transform: uppercase; display: inline-block; border: 4px solid #ffffff; box-shadow: 4px 4px 0px 0px #ffffff;">
                        Enter the Shop
                    </a>

                    <!-- INFO BOX -->
                    <div style="margin-top: 40px; border-top: 1px solid #333; padding-top: 20px;">
                        <p style="color: #666; font-size: 12px; text-transform: uppercase;">
                            Your Member ID is linked to this email.<br>
                            Always use <strong>${toEmail}</strong> when checking out.
                        </p>
                    </div>

                    <!-- FOOTER -->
                    <p style="margin-top: 50px; font-size: 10px; color: #444;">
                        NOT FOR PUBLIC SALE. RIGHT OF ADMISSION RESERVED.<br>
                        PORT ELIZABETH, SOUTH AFRICA
                    </p>
                </div>
                `
            });
            console.log(`📧 [Email] Sent WELCOME to ${toEmail}`);
        } catch (e) {
            console.error("❌ [Email-Welcome] Failed:", e);
        }
    }

};
