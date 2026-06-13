/**
 * POST /api/newsletter/webhook
 *
 * Resend-Webhook-Empfänger für Email-Events.
 * Verarbeitet: email.opened, email.clicked, email.bounced, email.complained
 *
 * Sicherheit: SVIX-Signaturprüfung mit RESEND_WEBHOOK_SECRET
 * Resend nutzt SVIX als Webhook-Infrastruktur.
 */

import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { createClient } from "@supabase/supabase-js";

interface ResendEvent {
  type:
    | "email.sent"
    | "email.delivered"
    | "email.delivery_delayed"
    | "email.opened"
    | "email.clicked"
    | "email.bounced"
    | "email.complained";
  data: {
    email_id: string;
    [key: string]: unknown;
  };
}

export async function POST(request: NextRequest) {
  // 1. Webhook-Secret prüfen
  const secret = process.env["RESEND_WEBHOOK_SECRET"];
  if (!secret) {
    console.error("[Webhook] RESEND_WEBHOOK_SECRET nicht gesetzt");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  // 2. SVIX-Signatur verifizieren
  const payload = await request.text();
  const svixHeaders = {
    "svix-id":        request.headers.get("svix-id")        ?? "",
    "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
    "svix-signature": request.headers.get("svix-signature") ?? "",
  };

  let event: ResendEvent;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(payload, svixHeaders) as ResendEvent;
  } catch (err) {
    console.error("[Webhook] Ungültige Signatur:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const { type, data } = event;
  const emailId = data.email_id;

  console.log(`[Webhook] Event: ${type} — email_id: ${emailId}`);

  // 3. Nur relevante Events verarbeiten
  const handled = ["email.opened", "email.clicked", "email.bounced", "email.complained"];
  if (!handled.includes(type)) {
    return NextResponse.json({ received: true, skipped: true });
  }

  // 4. Service-Role-Client
  const admin = createClient(
    process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
    process.env["SUPABASE_SERVICE_ROLE_KEY"]!,
    { auth: { persistSession: false } },
  );

  // 5. Event-Handling
  switch (type) {
    case "email.opened": {
      await admin
        .from("newsletters")
        .update({ opened_at: new Date().toISOString(), open_rate: 1.0 })
        .eq("resend_email_id", emailId)
        .is("opened_at", null); // nur erstes Öffnen zählen
      break;
    }

    case "email.clicked": {
      await admin
        .from("newsletters")
        .update({ clicked_at: new Date().toISOString(), click_rate: 1.0 })
        .eq("resend_email_id", emailId)
        .is("clicked_at", null); // nur ersten Klick zählen
      break;
    }

    case "email.bounced":
    case "email.complained": {
      // Newsletter-Zeile als gebounced markieren
      await admin
        .from("newsletters")
        .update({ bounced: true })
        .eq("resend_email_id", emailId);

      // User automatisch abmelden (Hard Bounce / Spam-Complaint)
      const { data: newsletter } = await admin
        .from("newsletters")
        .select("user_id")
        .eq("resend_email_id", emailId)
        .single();

      if (newsletter?.user_id) {
        await admin
          .from("users")
          .update({ newsletter_opt_in: false })
          .eq("id", newsletter.user_id);
        console.log(`[Webhook] User ${newsletter.user_id} automatisch abgemeldet (${type})`);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
