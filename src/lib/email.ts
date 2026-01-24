import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
                    <p>Your stash for <strong>Order #${orderId}</strong> is on its way via PUDO.</p>
                    
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
                </div>
            `
            });
            console.log(`📧 [Email] Sent PUDO details to ${toEmail}`);
        } catch (e) {
            console.error("❌ [Email] Failed to send:", e);
        }
    },

    async sendOrderConfirmation(
        toEmail: string,
        memberName: string,
        orderId: string,
        total: number,
        items: any[]
    ) {
        if (!process.env.RESEND_API_KEY) return;

        try {
            const itemsHtml = items.map(item => `
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #333; padding: 10px 0;">
                    <div>${item.quantity}x ${item.name}</div>
                    <div>R${item.price * item.quantity}</div>
                </div>
            `).join('');

            await resend.emails.send({
                from: FROM_EMAIL,
                to: toEmail,
                subject: `🔥 Order #${orderId} Confirmed`,
                html: `
                <div style="background-color: #000000; color: #facc15; font-family: 'Courier New', monospace; padding: 40px 20px;">
                    <h1 style="border-bottom: 4px solid #facc15; padding-bottom: 10px; text-transform: uppercase;">Order Secured</h1>
                    <p>Yo ${memberName},</p>
                    <p>We received your order <strong>#${orderId}</strong>.</p>
                    <p>Sit tight. We are processing it now.</p>

                    <div style="background: #111; padding: 20px; margin: 20px 0; border: 1px solid #333;">
                        <h3 style="margin-top: 0; border-bottom: 1px solid #555; padding-bottom: 5px;">STASH LIST</h3>
                        ${itemsHtml}
                        <div style="display: flex; justify-content: space-between; margin-top: 15px; font-size: 20px; font-weight: bold;">
                            <div>TOTAL</div>
                            <div>R${total}</div>
                        </div>
                    </div>

                    <p style="font-size: 12px; color: #666;">
                        You will receive another email when we dispatch via PUDO or when it's ready for collection.
                    </p>
                </div>
                `
            });
            console.log(`📧 [Email] Sent Order Confirmation to ${toEmail}`);
        } catch (e) {
            console.error("❌ [Email-OrderConf] Failed:", e);
        }
    },

    async sendAdminAlert(
        orderId: string,
        pudoDetails: { pin: string; waybill: string },
        memberName: string
    ) {
        if (!process.env.RESEND_API_KEY) return;
        const adminEmail = process.env.ADMIN_EMAIL || 'shotbykh@gmail.com';

        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: adminEmail,
                subject: `📦 [ADMIN] PUDO Booked for #${orderId}`,
                html: `<p>PUDO Booked for Order #${orderId} (Item Dispatched).</p>`
            });
        } catch (e) { console.error(e); }
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
                    <h1 style="margin: 0; font-size: 36px; text-transform: uppercase;">DANKBUD</h1>
                    <p style="margin: 5px 0 0; font-size: 12px; text-transform: uppercase;">Private Member Club</p>
                    <h2 style="font-size: 24px; text-transform: uppercase; margin: 20px 0;">You're In.</h2>
                    <p style="color: #fff; max-width: 400px; margin: 0 auto 30px;">Welcome to the underground. Your membership has been approved.</p>
                    <a href="https://dankbud.co.za/shop" style="background-color: #facc15; color: #000; padding: 15px 30px; font-weight: bold; text-decoration: none; text-transform: uppercase;">Enter Shop</a>
                </div>
                `
            });
            console.log(`📧 [Email] Sent WELCOME to ${toEmail}`);
        } catch (e) {
            console.error("❌ [Email-Welcome] Failed:", e);
        }
    }


    async sendPasswordChangedNotification(toEmail: string, memberName: string) {
        if (!process.env.RESEND_API_KEY) return;

        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: toEmail,
                subject: `🔐 Security Alert: Password Changed`,
                html: `
                <div style="background-color: #000000; color: #facc15; font-family: 'Courier New', Courier, monospace; padding: 40px 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 36px; text-transform: uppercase;">DANKBUD</h1>
                    <p style="margin: 5px 0 0; font-size: 12px; text-transform: uppercase;">Security Alert</p>
                    <h2 style="font-size: 24px; text-transform: uppercase; margin: 20px 0;">Password Reset.</h2>
                    <p style="color: #fff; max-width: 400px; margin: 0 auto 30px;">
                        Yo ${memberName}, your password was just changed. 
                        If this was you, you're good. If not, contact support immediately.
                    </p>
                    <a href="https://dankbud.co.za/shop" style="background-color: #facc15; color: #000; padding: 15px 30px; font-weight: bold; text-decoration: none; text-transform: uppercase;">Enter Shop</a>
                    <p style="color: #666; font-size: 10px; margin-top: 30px;">
                        Device: ${new Date().toISOString()}
                    </p>
                </div>
                `
            });
            console.log(`📧 [Email] Sent PASSWORD CHANGED to ${toEmail}`);
        } catch (e) {
            console.error("❌ [Email-PwdChanged] Failed:", e);
        }
    }
};
