BEGIN;

CREATE TABLE IF NOT EXISTS admin_auth_users (
  id text PRIMARY KEY,
  name text,
  email text UNIQUE,
  email_verified timestamp,
  image text
);

CREATE TABLE IF NOT EXISTS admin_auth_accounts (
  user_id text NOT NULL REFERENCES admin_auth_users(id) ON DELETE CASCADE,
  type text NOT NULL,
  provider text NOT NULL,
  provider_account_id text NOT NULL,
  refresh_token text,
  access_token text,
  expires_at integer,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  PRIMARY KEY (provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS admin_authenticators (
  credential_id text NOT NULL UNIQUE,
  user_id text NOT NULL REFERENCES admin_auth_users(id) ON DELETE CASCADE,
  provider_account_id text NOT NULL,
  credential_public_key text NOT NULL,
  counter integer NOT NULL,
  credential_device_type text NOT NULL,
  credential_backed_up boolean NOT NULL,
  transports text,
  PRIMARY KEY (user_id, credential_id)
);

COMMIT;
