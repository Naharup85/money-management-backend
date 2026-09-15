import type { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";

import { db } from "../../index.js";
import { usersTable } from "../../db/schema/users.js";
import ApiError from "../utility/apiErrors.js";


export async function loadCurrentUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.auth?.sub) {
      throw ApiError.unAuthorized("Unauthenticated");
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(
        eq(usersTable.logtoId, req.auth.sub),
      )

    if (!user) {
      throw  ApiError.notFound("User profile not found");
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}