BEGIN;

CREATE TABLE IF NOT EXISTS admin_users (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  email_verified boolean NOT NULL DEFAULT false,
  image text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id text PRIMARY KEY,
  token text NOT NULL UNIQUE,
  expires_at timestamp NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text,
  user_id text NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS admin_sessions_user_idx ON admin_sessions(user_id);

CREATE TABLE IF NOT EXISTS admin_accounts (
  id text PRIMARY KEY,
  account_id text NOT NULL,
  provider_id text NOT NULL,
  user_id text NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  access_token text,
  refresh_token text,
  id_token text,
  access_token_expires_at timestamp,
  refresh_token_expires_at timestamp,
  scope text,
  password text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS admin_accounts_user_idx ON admin_accounts(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS admin_accounts_provider_account_idx ON admin_accounts(provider_id, account_id);

CREATE TABLE IF NOT EXISTS admin_verifications (
  id text PRIMARY KEY,
  identifier text NOT NULL,
  value text NOT NULL,
  expires_at timestamp NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS admin_verifications_identifier_idx ON admin_verifications(identifier);

CREATE TABLE IF NOT EXISTS admin_passkeys (
  id text PRIMARY KEY,
  name text,
  public_key text NOT NULL,
  user_id text NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  credential_id text NOT NULL UNIQUE,
  counter integer NOT NULL,
  device_type text NOT NULL,
  backed_up boolean NOT NULL,
  transports text,
  created_at timestamp,
  aaguid text
);
CREATE INDEX IF NOT EXISTS admin_passkeys_user_idx ON admin_passkeys(user_id);

COMMIT;
