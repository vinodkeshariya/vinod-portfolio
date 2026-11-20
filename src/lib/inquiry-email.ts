/**
 * Builds the email sent to the site owner when someone submits the contact form.
 * Plain module (no imports) so it can be previewed outside Next.js.
 * Email-safe HTML: tables, inline styles, system fonts.
 */

export type Inquiry = {
  name: string;
  email: string;
  company: string;
  type: string;
  budget: string;
  message: string;
  siteUrl: string;
  receivedAt: Date;
};

/** Site colours (globals.css) */
const C = {
  forest: "#153d35",
  lime: "#b9d96c",
  paper: "#f5f3ec",
  soft: "#f1f6e3",
  ink: "#242824",
  ink2: "#3c423b",
  muted: "#565d55",
  line: "#e1e2d9",
  onForest: "#d5dfd4",
};

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function inquiryEmail(q: Inquiry) {
  const when = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(
    q.receivedAt,
  );
  const host = q.siteUrl.replace(/^https?:\/\//, "");
  const first = q.name.split(" ")[0];
  const type = q.type || "Not specified";
  const budget = q.budget || "Not specified";
  const company = q.company || "—";
  const replyHref = `mailto:${q.email}?subject=${encodeURIComponent("Re: Your project inquiry")}`;

  const subject = `New project inquiry from ${q.name}${q.type ? ` · ${q.type}` : ""}`;

  const text = [
    `NEW PROJECT INQUIRY — ${when} IST`,
    "",
    `Name:          ${q.name}`,
    `Email:         ${q.email}`,
    `Company / web: ${company}`,
    `Project type:  ${type}`,
    `Budget:        ${budget}`,
    "",
    "Project description",
    "-------------------",
    q.message,
    "",
    `Reply to this email to answer ${q.name} directly.`,
    `Sent from the contact form on ${host}`,
  ].join("\n");

  const companyHtml = /^https?:\/\/\S+$/i.test(q.company)
    ? `<a href="${esc(q.company)}" style="color:${C.forest};text-decoration:underline;">${esc(q.company)}</a>`
    : esc(company);

  const row = (label: string, value: string, last = false) => `
              <tr>
                <td valign="top" style="padding:12px 16px 12px 0;width:132px;font-size:13px;color:${C.muted};${last ? "" : `border-bottom:1px solid ${C.line};`}">${label}</td>
                <td valign="top" style="padding:12px 0;font-size:15px;font-weight:600;color:${C.ink};word-break:break-word;${last ? "" : `border-bottom:1px solid ${C.line};`}">${value}</td>
              </tr>`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${C.paper};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(`${type} · ${q.message}`.slice(0, 140))}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.paper};">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid ${C.line};border-radius:18px;overflow:hidden;font-family:${FONT};">
          <tr>
            <td style="background:${C.forest};padding:28px 28px 26px;">
              <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${C.lime};">&#9679;&nbsp; New project inquiry</p>
              <h1 style="margin:0;font-size:24px;line-height:1.3;font-weight:800;color:#ffffff;">${esc(q.name)} wants to discuss a project</h1>
              <p style="margin:10px 0 0;font-size:14px;color:${C.onForest};">Received ${esc(when)} IST</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 4px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${row(
                "Email",
                `<a href="${esc(replyHref)}" style="color:${C.forest};text-decoration:underline;">${esc(q.email)}</a>`,
              )}${row("Company / website", companyHtml)}${row(
                "Project type",
                `<span style="display:inline-block;background:${C.soft};border:1px solid #d9e7b8;border-radius:999px;padding:3px 10px;font-size:13px;color:${C.forest};">${esc(type)}</span>`,
              )}${row("Budget", esc(budget), true)}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 0;">
              <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${C.muted};">Project description</p>
              <div style="background:${C.paper};border-left:3px solid ${C.lime};border-radius:10px;padding:16px 18px;font-size:15px;line-height:1.65;color:${C.ink2};word-break:break-word;">${esc(q.message).replace(/\r?\n/g, "<br>")}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:${C.forest};border-radius:999px;">
                    <a href="${esc(replyHref)}" style="display:inline-block;padding:13px 24px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">Reply to ${esc(first)} &rarr;</a>
                  </td>
                </tr>
              </table>
              <p style="margin:12px 0 0;font-size:13px;color:${C.muted};">Or just hit <strong>Reply</strong> — it goes straight to ${esc(q.email)}.</p>
            </td>
          </tr>
        </table>
        <p style="margin:18px 0 0;font-family:${FONT};font-size:12px;color:${C.muted};">Sent from the contact form on <a href="${esc(q.siteUrl)}" style="color:${C.muted};">${esc(host)}</a></p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}
