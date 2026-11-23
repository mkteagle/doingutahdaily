import { bigint, boolean, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { adminSessions, adminUsers } from "./betterAuthSchema";

// Better Auth OAuth Provider, JWT, and database rate-limit tables.
const jwks = pgTable("admin_jwks", {
  id: text("id").primaryKey(),
  publicKey: text("public_key").notNull(),
  privateKey: text("private_key").notNull(),
  createdAt: timestamp("created_at").notNull(),
  expiresAt: timestamp("expires_at"),
  alg: text("alg"),
  crv: text("crv"),
});

const oauthClient = pgTable("admin_oauth_client", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull().unique(),
  clientSecret: text("client_secret"),
  clientDiscoveryId: text("client_discovery_id"),
  disabled: boolean("disabled").default(false),
  skipConsent: boolean("skip_consent"),
  enableEndSession: boolean("enable_end_session"),
  subjectType: text("subject_type"),
  scopes: text("scopes").array(),
  clientCredentialsScopes: text("client_credentials_scopes").array().default([]),
  userId: text("user_id").references(() => adminUsers.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
  name: text("name"),
  uri: text("uri"),
  icon: text("icon"),
  contacts: text("contacts").array(),
  tos: text("tos"),
  policy: text("policy"),
  softwareId: text("software_id"),
  softwareVersion: text("software_version"),
  softwareStatement: text("software_statement"),
  redirectUris: text("redirect_uris").array().notNull(),
  postLogoutRedirectUris: text("post_logout_redirect_uris").array(),
  backchannelLogoutUri: text("backchannel_logout_uri"),
  backchannelLogoutSessionRequired: boolean("backchannel_logout_session_required"),
  tokenEndpointAuthMethod: text("token_endpoint_auth_method"),
  applicationType: text("application_type"),
  jwks: text("jwks"),
  jwksUri: text("jwks_uri"),
  grantTypes: text("grant_types").array(),
  responseTypes: text("response_types").array(),
  requirePKCE: boolean("require_pkce"),
  dpopBoundAccessTokens: boolean("dpop_bound_access_tokens").default(false),
  referenceId: text("reference_id"),
  metadata: jsonb("metadata"),
}, (table) => [
  index("admin_oauth_client_user_id_idx").on(table.userId),
]);

const oauthResource = pgTable("admin_oauth_resource", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull().unique(),
  name: text("name").notNull(),
  accessTokenTtl: integer("access_token_ttl"),
  refreshTokenTtl: integer("refresh_token_ttl"),
  signingAlgorithm: text("signing_algorithm"),
  signingKeyId: text("signing_key_id"),
  allowedScopes: text("allowed_scopes").array(),
  customClaims: jsonb("custom_claims"),
  dpopBoundAccessTokensRequired: boolean("dpop_bound_access_tokens_required").default(false),
  disabled: boolean("disabled").default(false),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
  policyVersion: integer("policy_version").default(1),
  metadata: jsonb("metadata"),
});

const oauthClientResource = pgTable("admin_oauth_client_resource", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull().references(() => oauthClient.clientId, { onDelete: "cascade" }),
  resourceId: text("resource_id").notNull().references(() => oauthResource.identifier, { onDelete: "cascade" }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at"),
}, (table) => [
  index("admin_oauth_client_resource_client_id_idx").on(table.clientId),
  index("admin_oauth_client_resource_resource_id_idx").on(table.resourceId),
  uniqueIndex("admin_oauth_client_resource_client_id_resource_id_idx").on(table.clientId, table.resourceId),
]);

const oauthRefreshToken = pgTable("admin_oauth_refresh_token", {
  id: text("id").primaryKey(),
  token: text("token").notNull().unique(),
  clientId: text("client_id").notNull().references(() => oauthClient.clientId, { onDelete: "cascade" }),
  sessionId: text("session_id").references(() => adminSessions.id, { onDelete: "set null" }),
  userId: text("user_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
  referenceId: text("reference_id"),
  authorizationCodeId: text("authorization_code_id"),
  resources: text("resources").array(),
  requestedUserInfoClaims: text("requested_user_info_claims").array(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull(),
  revoked: timestamp("revoked"),
  rotatedAt: timestamp("rotated_at"),
  rotationReplayResponse: text("rotation_replay_response"),
  rotationReplayExpiresAt: timestamp("rotation_replay_expires_at"),
  authTime: timestamp("auth_time"),
  confirmation: jsonb("confirmation"),
  scopes: text("scopes").array().notNull(),
}, (table) => [
  index("admin_oauth_refresh_token_client_id_idx").on(table.clientId),
  index("admin_oauth_refresh_token_session_id_idx").on(table.sessionId),
  index("admin_oauth_refresh_token_user_id_idx").on(table.userId),
  index("admin_oauth_refresh_token_authorization_code_id_idx").on(table.authorizationCodeId),
]);

const oauthAccessToken = pgTable("admin_oauth_access_token", {
  id: text("id").primaryKey(),
  token: text("token").notNull().unique(),
  clientId: text("client_id").notNull().references(() => oauthClient.clientId, { onDelete: "cascade" }),
  sessionId: text("session_id").references(() => adminSessions.id, { onDelete: "set null" }),
  userId: text("user_id").references(() => adminUsers.id, { onDelete: "cascade" }),
  referenceId: text("reference_id"),
  authorizationCodeId: text("authorization_code_id"),
  resources: text("resources").array(),
  requestedUserInfoClaims: text("requested_user_info_claims").array(),
  refreshId: text("refresh_id").references(() => oauthRefreshToken.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull(),
  revoked: timestamp("revoked"),
  confirmation: jsonb("confirmation"),
  scopes: text("scopes").array().notNull(),
}, (table) => [
  index("admin_oauth_access_token_client_id_idx").on(table.clientId),
  index("admin_oauth_access_token_session_id_idx").on(table.sessionId),
  index("admin_oauth_access_token_user_id_idx").on(table.userId),
  index("admin_oauth_access_token_authorization_code_id_idx").on(table.authorizationCodeId),
  index("admin_oauth_access_token_refresh_id_idx").on(table.refreshId),
]);

const oauthConsent = pgTable("admin_oauth_consent", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull().references(() => oauthClient.clientId, { onDelete: "cascade" }),
  userId: text("user_id").references(() => adminUsers.id, { onDelete: "cascade" }),
  referenceId: text("reference_id"),
  resources: text("resources").array(),
  requestedUserInfoClaims: text("requested_user_info_claims").array(),
  scopes: text("scopes").array().notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
}, (table) => [
  index("admin_oauth_consent_client_id_idx").on(table.clientId),
  index("admin_oauth_consent_user_id_idx").on(table.userId),
]);

const oauthClientAssertion = pgTable("admin_oauth_client_assertion", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
});

const rateLimit = pgTable("admin_rate_limit", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});

export const adminOAuthSchema = {
  jwks,
  oauthClient,
  oauthResource,
  oauthClientResource,
  oauthRefreshToken,
  oauthAccessToken,
  oauthConsent,
  oauthClientAssertion,
  rateLimit,
};

export { jwks, oauthClient, oauthResource, oauthClientResource, oauthRefreshToken, oauthAccessToken, oauthConsent, oauthClientAssertion, rateLimit };
