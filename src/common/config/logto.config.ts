import { env } from "../config/env.js";

export const logtoConfig = {
  endpoint: env.LOGTO_ENDPOINT!,
  issuer: `${env.LOGTO_ENDPOINT!}/oidc`,
  jwksUri: `${env.LOGTO_ENDPOINT!}/oidc/jwks`,
  audience: env.LOGTO_API_RESOURCE!,

};