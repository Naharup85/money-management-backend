import { Router } from "express"
import * as userController from "./controller.js"
import validate from "../../common/middleware/dto.middleware.js";

import { registerDto } from "./dto.js";

const router = Router();


router.post("/register",validate(registerDto), userController.register);
router.get("/profile",  userController.getProfile)


export default router;

