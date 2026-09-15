import type { AuthPayload } from "../common/middleware/auth.middleware";
import type { User } from "../db/schema/users.js";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
      user?: User;
    }
  }
}

export {};