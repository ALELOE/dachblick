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

function buildConfirmationEmail(payload: LeadPayload): string {
  const { customer, metadata } = payload;
  const massnahmeLabel = metadata.massnahme === 'austausch' ? 'Dachfenster Austausch' : 'Dachfenster Neueinbau';
  const zubehoerText = metadata.zubehoer.length ? metadata.zubehoer.join(', ') : 'Kein Zubehör';

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9f7f0;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f7f0;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:24px;overflow:hidden;max-width:600px;width:100%;">
        <tr>
          <td style="background:rgb(11,8,51);padding:32px 40px;">
            <p style="margin:0;font-size:26px;font-weight:500;color:#fff;letter-spacing:-0.01em;">Dachblick</p>
            <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.5);letter-spacing:0.06em;text-transform:uppercase;">Ihre Velux Anfrage ist eingegangen</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 16px;font-size:22px;color:rgb(24,19,89);">Hallo ${customer.vorname},</p>
            <p style="margin:0 0 24px;font-size:16px;color:rgba(24,19,89,0.7);line-height:1.6;">
              vielen Dank für Ihre Anfrage. Wir haben Ihre Angaben erhalten und werden uns
              <strong style="color:rgb(24,19,89);">innerhalb von 24 Stunden</strong> mit einem
              kostenlosen Festpreisangebot bei Ihnen melden.
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

            <p style="margin:0 0 8px;font-size:14px;color:rgba(24,19,89,0.5);">
              Bitte schauen Sie auch in Ihren Spam-Ordner, falls Sie keine E-Mail von uns erhalten.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:rgb(250,247,240);padding:24px 40px;border-top:1px solid rgb(237,230,215);">
            <p style="margin:0;font-size:13px;color:rgba(24,19,89,0.4);">© ${new Date().getFullYear()} Dachblick · <a href="https://dachblick.de/datenschutz" style="color:rgba(24,19,89,0.4);">Datenschutz</a> · <a href="https://dachblick.de/impressum" style="color:rgba(24,19,89,0.4);">Impressum</a></p>
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
    return new Response(JSON.stringify({ error: 'Ungültiges JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { customer, metadata } = body ?? {};

  if (!customer?.vorname || !customer?.nachname || !customer?.email || !customer?.telefon || !customer?.plz) {
    return new Response(JSON.stringify({ error: 'Pflichtfelder fehlen' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  if (!metadata?.massnahme || !metadata?.breite || !metadata?.hoehe) {
    return new Response(JSON.stringify({ error: 'Angaben unvollständig' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const errors: string[] = [];

  // 1. Forward to CRM webhook
  const webhookUrl = import.meta.env.CRM_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (err) {
      errors.push('CRM webhook failed');
      console.error('CRM webhook error:', err);
    }
  }

  // 2. Send confirmation email via Resend
  const resendKey = import.meta.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: 'Dachblick <anfrage@dachblick.de>',
        to: customer.email,
        subject: 'Ihre Dachblick Velux Anfrage ist eingegangen',
        html: buildConfirmationEmail(body),
      });
    } catch (err) {
      errors.push('Email delivery failed');
      console.error('Resend error:', err);
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
