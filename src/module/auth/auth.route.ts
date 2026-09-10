import { Router } from "express"
import * as userController from "./auth.user.controller.js"
import validate from "../../common/validation/validation.js";
import { registerDto, loginDto } from "./auth.Dto.js";

const router=Router();

router.post("/register",validate(registerDto),userController.register)
router.post("/login",validate(loginDto),userController.login)



export default router;

