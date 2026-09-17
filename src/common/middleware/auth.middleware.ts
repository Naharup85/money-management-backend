import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { logtoConfig } from "../config/logto.config.js";
import type { Request, Response, NextFunction } from "express";
import ApiResponse from "../utility/apiResponse.js";
import ApiError from "../utility/apiErrors.js";

const jwks = createRemoteJWKSet(
  new URL(logtoConfig.jwksUri)
);

export interface AuthPayload extends JWTPayload {
  sub: string;
  clientId?: string | undefined;
  scopes?: string[];
  audience?: string[];
  email?:string;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.method === "OPTIONS") {
      next();
      return;
    }

  
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw  ApiError.notFound("Authorization header is required");
    }

    if (!authorization.startsWith("Bearer ")) {
      throw  ApiError.unAuthorized("Invalid authorization format");
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
      email:payload.email as string,
    };

    next();
  } catch (error) {
    

    throw ApiError.unAuthorized("Invalid or expired access token");
  }
};