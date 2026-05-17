#!/usr/bin/env sh
set -eu

PROJECT_REF="${SUPABASE_PROJECT_REF:-bwslltcjdinhsqkmadfz}"
SMTP_FROM_EMAIL="${SUPABASE_SMTP_FROM_EMAIL:-}"
SMTP_SENDER_NAME="${SUPABASE_SMTP_SENDER_NAME:-SmartFlowFinance}"

if [ -z "${SUPABASE_ACCESS_TOKEN:-}" ]; then
  echo "Missing SUPABASE_ACCESS_TOKEN."
  echo "Create one at https://supabase.com/dashboard/account/tokens and export it before running this script."
  exit 1
fi

if [ -z "${RESEND_API_KEY:-}" ]; then
  echo "Missing RESEND_API_KEY."
  echo "Create an API key in Resend and export it before running this script."
  exit 1
fi

if [ -z "$SMTP_FROM_EMAIL" ]; then
  echo "Missing SUPABASE_SMTP_FROM_EMAIL."
  echo "Use an email from a domain verified in Resend, for example no-reply@seudominio.com."
  exit 1
fi

curl -fsS -X PATCH "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"external_email_enabled\": true,
    \"mailer_secure_email_change_enabled\": true,
    \"mailer_autoconfirm\": false,
    \"smtp_admin_email\": \"$SMTP_FROM_EMAIL\",
    \"smtp_host\": \"smtp.resend.com\",
    \"smtp_port\": 465,
    \"smtp_user\": \"resend\",
    \"smtp_pass\": \"$RESEND_API_KEY\",
    \"smtp_sender_name\": \"$SMTP_SENDER_NAME\"
  }"

echo
echo "Supabase Auth SMTP configured with Resend for project $PROJECT_REF."
