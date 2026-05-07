export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

interface LeadPayload {
  service_type: string;
  metadata: {
    massnahme: string;
    typenschild?: string;
    breite: string;
    hoehe: string;
    dachneigung?: string;
    anzahl: number;
    zubehoer: string[];
  };
  customer: {
    vorname: string;
    nachname: string;
    email: string;
    telefon: string;
    plz: string;
    anmerkungen?: string;
  };
}

function buildOwnerEmail(payload: LeadPayload): string {
  const { customer, metadata } = payload;
  const massnahmeLabel = metadata.massnahme === 'austausch' ? 'Dachfenster Austausch' : 'Dachfenster Neueinbau';
  const zubehoerText = metadata.zubehoer.length ? metadata.zubehoer.join(', ') : 'Kein Zubehör';

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f9f7f0;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:24px;overflow:hidden;max-width:600px;width:100%;">
        <tr>
          <td style="background:rgb(11,8,51);padding:28px 36px;">
            <p style="margin:0;font-size:22px;font-weight:600;color:#fff;">🔔 Neue Anfrage — Dachblick</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px;">
            <div style="background:rgb(250,247,240);border-radius:16px;padding:24px;margin-bottom:24px;">
              <p style="margin:0 0 14px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:rgba(24,19,89,0.5);">Kundendaten</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:5px 0;font-size:15px;color:rgba(24,19,89,0.6);width:35%;">Name</td><td style="padding:5px 0;font-size:15px;color:rgb(24,19,89);font-weight:500;">${customer.vorname} ${customer.nachname}</td></tr>
                <tr><td style="padding:5px 0;font-size:15px;color:rgba(24,19,89,0.6);">E-Mail</td><td style="padding:5px 0;font-size:15px;"><a href="mailto:${customer.email}" style="color:rgb(44,31,162);">${customer.email}</a></td></tr>
                <tr><td style="padding:5px 0;font-size:15px;color:rgba(24,19,89,0.6);">Telefon</td><td style="padding:5px 0;font-size:15px;"><a href="tel:${customer.telefon}" style="color:rgb(44,31,162);">${customer.telefon}</a></td></tr>
                <tr><td style="padding:5px 0;font-size:15px;color:rgba(24,19,89,0.6);">PLZ</td><td style="padding:5px 0;font-size:15px;color:rgb(24,19,89);font-weight:500;">${customer.plz}</td></tr>
              </table>
            </div>
            <div style="background:rgb(250,247,240);border-radius:16px;padding:24px;">
              <p style="margin:0 0 14px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:rgba(24,19,89,0.5);">Anfrage Details</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:5px 0;font-size:15px;color:rgba(24,19,89,0.6);width:35%;">Leistung</td><td style="padding:5px 0;font-size:15px;color:rgb(24,19,89);font-weight:500;">${massnahmeLabel}</td></tr>
                <tr><td style="padding:5px 0;font-size:15px;color:rgba(24,19,89,0.6);">Maße</td><td style="padding:5px 0;font-size:15px;color:rgb(24,19,89);font-weight:500;">${metadata.breite} × ${metadata.hoehe} cm</td></tr>
                ${metadata.typenschild ? `<tr><td style="padding:5px 0;font-size:15px;color:rgba(24,19,89,0.6);">Typenschild</td><td style="padding:5px 0;font-size:15px;color:rgb(24,19,89);font-weight:500;">${metadata.typenschild}</td></tr>` : ''}
                ${metadata.dachneigung ? `<tr><td style="padding:5px 0;font-size:15px;color:rgba(24,19,89,0.6);">Dachneigung</td><td style="padding:5px 0;font-size:15px;color:rgb(24,19,89);font-weight:500;">${metadata.dachneigung}</td></tr>` : ''}
                <tr><td style="padding:5px 0;font-size:15px;color:rgba(24,19,89,0.6);">Anzahl</td><td style="padding:5px 0;font-size:15px;color:rgb(24,19,89);font-weight:500;">${metadata.anzahl} Fenster</td></tr>
                <tr><td style="padding:5px 0;font-size:15px;color:rgba(24,19,89,0.6);">Zubehör</td><td style="padding:5px 0;font-size:15px;color:rgb(24,19,89);font-weight:500;">${zubehoerText}</td></tr>
                ${customer.anmerkungen ? `<tr><td style="padding:5px 0;font-size:15px;color:rgba(24,19,89,0.6);">Anmerkungen</td><td style="padding:5px 0;font-size:15px;color:rgb(24,19,89);">${customer.anmerkungen}</td></tr>` : ''}
              </table>
            </div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildConfirmationEmail(payload: LeadPayload): string {
  const { customer, metadata } = payload;
  const massnahmeLabel = metadata.massnahme === 'austausch' ? 'Dachfenster Austausch' : 'Dachfenster Neueinbau';
  const zubehoerText = metadata.zubehoer.length ? metadata.zubehoer.join(', ') : 'Kein Zubehör';

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9f7f0;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:24px;overflow:hidden;max-width:600px;width:100%;">
        <tr>
          <td style="background:rgb(11,8,51);padding:32px 40px;">
            <p style="margin:0;font-size:26px;font-weight:500;color:#fff;letter-spacing:-0.01em;">Dachblick</p>
            <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.5);letter-spacing:0.06em;text-transform:uppercase;">Ihre Anfrage ist eingegangen</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 16px;font-size:22px;color:rgb(24,19,89);">Hallo ${customer.vorname},</p>
            <p style="margin:0 0 24px;font-size:16px;color:rgba(24,19,89,0.7);line-height:1.6;">
              vielen Dank für Ihre Anfrage. Wir werden uns
              <strong style="color:rgb(24,19,89);">innerhalb von 24 Stunden</strong> mit einem
              kostenlosen Angebot bei Ihnen melden.
            </p>
            <div style="background:rgb(250,247,240);border-radius:16px;padding:24px;margin-bottom:24px;">
              <p style="margin:0 0 12px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:rgba(24,19,89,0.5);">Ihre Angaben</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:4px 0;font-size:15px;color:rgba(24,19,89,0.6);width:40%;">Leistung</td><td style="padding:4px 0;font-size:15px;color:rgb(24,19,89);font-weight:500;">${massnahmeLabel}</td></tr>
                <tr><td style="padding:4px 0;font-size:15px;color:rgba(24,19,89,0.6);">Maße</td><td style="padding:4px 0;font-size:15px;color:rgb(24,19,89);font-weight:500;">${metadata.breite} × ${metadata.hoehe} cm</td></tr>
                <tr><td style="padding:4px 0;font-size:15px;color:rgba(24,19,89,0.6);">Anzahl</td><td style="padding:4px 0;font-size:15px;color:rgb(24,19,89);font-weight:500;">${metadata.anzahl} Fenster</td></tr>
                <tr><td style="padding:4px 0;font-size:15px;color:rgba(24,19,89,0.6);">PLZ</td><td style="padding:4px 0;font-size:15px;color:rgb(24,19,89);font-weight:500;">${customer.plz}</td></tr>
                <tr><td style="padding:4px 0;font-size:15px;color:rgba(24,19,89,0.6);">Zubehör</td><td style="padding:4px 0;font-size:15px;color:rgb(24,19,89);font-weight:500;">${zubehoerText}</td></tr>
              </table>
            </div>
            <p style="margin:0;font-size:14px;color:rgba(24,19,89,0.5);">Bitte schauen Sie auch in Ihren Spam-Ordner.</p>
          </td>
        </tr>
        <tr>
          <td style="background:rgb(250,247,240);padding:24px 40px;border-top:1px solid rgb(237,230,215);">
            <p style="margin:0;font-size:13px;color:rgba(24,19,89,0.4);">© ${new Date().getFullYear()} Dachblick</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export const POST: APIRoute = async ({ request }) => {
  let body: LeadPayload;

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Ungültiges JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { customer, metadata } = body ?? {};

  if (!customer?.vorname || !customer?.nachname || !customer?.email || !customer?.telefon || !customer?.plz) {
    return new Response(JSON.stringify({ error: 'Pflichtfelder fehlen' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!metadata?.massnahme || !metadata?.breite || !metadata?.hoehe) {
    return new Response(JSON.stringify({ error: 'Angaben unvollständig' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const resendKey = import.meta.env.RESEND_API_KEY;
  const leadEmail = import.meta.env.LEAD_EMAIL;
  const webhookUrl = import.meta.env.CRM_WEBHOOK_URL;

  if (!resendKey && !webhookUrl) {
    console.error('No delivery method configured. Set RESEND_API_KEY + LEAD_EMAIL or CRM_WEBHOOK_URL.');
    return new Response(
      JSON.stringify({ error: 'Konfigurationsfehler — bitte den Administrator kontaktieren.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const deliveryErrors: string[] = [];

  // 1. Forward to CRM webhook
  if (webhookUrl) {
    const webhookSecret = import.meta.env.CRM_WEBHOOK_SECRET;
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(webhookSecret ? { 'x-webhook-secret': webhookSecret } : {}),
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Webhook status ${res.status}`);
    } catch (err) {
      deliveryErrors.push('CRM webhook failed');
      console.error('CRM webhook error:', err);
    }
  }

  // 2. Send emails via Resend
  if (resendKey) {
    const resend = new Resend(resendKey);

    // 2a. Internal lead notification to the business owner
    if (leadEmail) {
      try {
        const { error } = await resend.emails.send({
          from: 'Dachblick Leads <onboarding@resend.dev>',
          to: leadEmail,
          subject: `Neue Anfrage von ${customer.vorname} ${customer.nachname} (PLZ ${customer.plz})`,
          html: buildOwnerEmail(body),
        });
        if (error) throw new Error(error.message);
      } catch (err) {
        deliveryErrors.push('Owner notification failed');
        console.error('Owner email error:', err);
      }
    }

    // 2b. Confirmation email to the customer
    try {
      const { error } = await resend.emails.send({
        from: 'Dachblick <onboarding@resend.dev>',
        to: customer.email,
        subject: 'Ihre Dachblick Anfrage ist eingegangen',
        html: buildConfirmationEmail(body),
      });
      if (error) throw new Error(error.message);
    } catch (err) {
      deliveryErrors.push('Customer confirmation failed');
      console.error('Customer email error:', err);
    }
  }

  // If every configured method failed, surface the error
  const configuredMethods = (webhookUrl ? 1 : 0) + (resendKey ? 1 : 0);
  if (deliveryErrors.length >= configuredMethods) {
    return new Response(
      JSON.stringify({ error: 'Anfrage konnte nicht übermittelt werden. Bitte versuchen Sie es erneut.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
