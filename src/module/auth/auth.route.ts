import { Router } from "express"
import * as userController from "./auth.user.controller.js"
import validate from "../../common/dto/validation.js";
import { registerDto } from "./auth.Dto.js";

const router=Router();

router.post("/register",validate(registerDto),userController.register)



export default router;

