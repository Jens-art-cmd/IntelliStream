/**
 * DistillFeed Weekly Briefing HTML-Template
 * Editorial design: cream/amber, premium B2B magazine
 */

export interface ArticleItem {
  id: string;
  title: string;
  summary_short: string | null;
  impact_level: "high" | "medium" | "low" | null;
  source_url: string;
  published_at: string | null;
  industry_name: string;
}

const IMPACT_LABEL: Record<string, string> = {
  high:   "Hoher Impact",
  medium: "Mittlerer Impact",
  low:    "Geringer Impact",
};

const IMPACT_COLOR: Record<string, string> = {
  high:   "#E08900",
  medium: "#8C887E",
  low:    "#C8C2B6",
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function articleCard(a: ArticleItem, appUrl: string, rank: number): string {
  const impact = a.impact_level ?? "low";
  return `
    <tr>
      <td style="padding:0 0 20px 0;">
        <table width="100%" cellpadding="0" cellspacing="0"
               style="background:#FFFFFF;border:1px solid #E2DDD2;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="padding:20px 24px;">
              <!-- Rank + Industry + Impact badges -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 10px 0;">
                <tr>
                  <td style="background:#1A1813;border-radius:20px;padding:3px 10px;
                              font-size:10px;font-weight:700;color:#FFB300;
                              letter-spacing:0.1em;">
                    #${rank}
                  </td>
                  <td width="6"></td>
                  <td style="background:#F1EDE4;border-radius:20px;padding:3px 10px;
                              font-size:10px;font-weight:700;color:#57534A;
                              letter-spacing:0.1em;text-transform:uppercase;">
                    ${a.industry_name}
                  </td>
                  <td width="6"></td>
                  <td style="background:#FFF6E0;border-radius:20px;padding:3px 10px;
                              font-size:10px;font-weight:700;
                              color:${IMPACT_COLOR[impact]};
                              letter-spacing:0.08em;text-transform:uppercase;">
                    ${IMPACT_LABEL[impact] ?? impact}
                  </td>
                </tr>
              </table>

              <!-- Title -->
              <h3 style="margin:0 0 8px 0;font-size:15px;font-weight:600;
                          color:#1A1813;line-height:1.4;letter-spacing:-0.01em;">
                <a href="${a.source_url}"
                   style="color:#1A1813;text-decoration:none;">
                  ${a.title}
                </a>
              </h3>

              <!-- Summary -->
              ${a.summary_short ? `
              <p style="margin:0 0 14px 0;font-size:13px;color:#57534A;line-height:1.6;">
                ${a.summary_short}
              </p>
              ` : ""}

              <!-- Footer row -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:11px;color:#C8C2B6;">
                    ${formatDate(a.published_at)}
                  </td>
                  <td align="right">
                    <a href="${a.source_url}"
                       style="font-size:11px;font-weight:700;color:#E08900;
                              text-decoration:none;letter-spacing:0.05em;">
                      Artikel lesen →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

export function buildNewsletterHtml(
  articles: ArticleItem[],
  email: string,
  _frequency: "daily" | "weekly",
  appUrl: string,
  unsubscribeUrl: string,
): string {
  const today = new Date().toLocaleDateString("de-DE", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const articleRows = articles.map((a, i) => articleCard(a, appUrl, i + 1)).join("");

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Weekly Briefing – DistillFeed</title>
</head>
<body style="margin:0;padding:0;background:#FAF8F4;
             font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"
         style="background:#FAF8F4;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1A1813 0%,#2D2820 100%);
                     border-radius:12px 12px 0 0;padding:32px 40px 28px 40px;">
            <p style="margin:0 0 4px 0;font-size:10px;font-weight:700;
                      letter-spacing:0.2em;text-transform:uppercase;color:#FFB300;">
              DistillFeed
            </p>
            <h1 style="margin:0 0 6px 0;font-size:24px;font-weight:300;
                        color:#FFFFFF;letter-spacing:-0.02em;line-height:1.2;">
              Weekly Briefing
            </h1>
            <p style="margin:0;font-size:12px;color:#8C887E;">${today}</p>
          </td>
        </tr>

        <!-- Intro bar -->
        <tr>
          <td style="background:#FFB300;padding:14px 40px;">
            <p style="margin:0;font-size:12px;font-weight:600;color:#1A1100;
                      letter-spacing:0.02em;">
              Die ${articles.length} wichtigsten Meldungen aus deinen Branchen — KI-kuratiert, impact-gerankt.
            </p>
          </td>
        </tr>

        <!-- Articles -->
        <tr>
          <td style="background:#FAF8F4;padding:28px 32px 8px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${articleRows}
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="background:#FAF8F4;padding:0 32px 28px 32px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#1A1813;border-radius:8px;">
                  <a href="${appUrl}/dashboard/feed"
                     style="display:inline-block;padding:13px 24px;font-size:12px;
                            font-weight:700;color:#FFB300;text-decoration:none;
                            letter-spacing:0.04em;">
                    Alle Meldungen im Dashboard →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="background:#FAF8F4;padding:0 32px;">
            <hr style="border:none;border-top:1px solid #E2DDD2;margin:0;" />
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#FAF8F4;border-radius:0 0 12px 12px;
                     padding:20px 40px 32px 40px;">
            <p style="margin:0 0 6px 0;font-size:11px;color:#C8C2B6;line-height:1.5;">
              Du erhältst dieses Briefing, weil du es für
              <strong style="color:#8C887E;">${email}</strong> abonniert hast.
            </p>
            <p style="margin:0;font-size:11px;color:#C8C2B6;line-height:1.5;">
              DistillFeed · distillfeed.eu ·
              <a href="${unsubscribeUrl}" style="color:#C8C2B6;">Abmelden</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
