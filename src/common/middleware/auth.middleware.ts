import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { logtoConfig } from "../config/logto.config.js";
import type { Request, Response, NextFunction } from "express";

const jwks = createRemoteJWKSet(
  new URL(logtoConfig.jwksUri)
);

export interface LogtoUser {
  sub: string;
  clientId?: string | undefined;
  scopes: string[];
  audience: string[];
}

declare global {
  namespace Express {
    interface Request {
      auth?: LogtoUser;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Authorization header is required",
      });
    }

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    const token = authorization.substring(7);

    const { payload } = await jwtVerify(token, jwks, {
      issuer: logtoConfig.issuer,
      audience: logtoConfig.audience,
    });

    const scopes =
      typeof payload.scope === "string"
        ? payload.scope.split(" ")
        : [];

    const audience = Array.isArray(payload.aud)
      ? payload.aud
      : payload.aud
        ? [payload.aud]
        : [];

    req.auth = {
      sub: payload.sub!,
      clientId: payload.client_id as string | undefined,
      scopes,
      audience,
    };

    next();
  } catch (error) {
    console.error("Logto authentication error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};