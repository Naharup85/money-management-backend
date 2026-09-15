import { Router } from "express";
import validate from "../../common/middleware/dto.middleware.js";
import  { accountSchema, updateAccountSchema } from "./dto.js";
import * as accountController from "./controller.js";


const router = Router();

router.post("/create", validate(accountSchema), accountController.createAccount);
router.get("/:userId", accountController.getUserAccounts);
router.patch("/:accountId", validate(updateAccountSchema), accountController.updateAccount);
router.delete("/:accountId", accountController.deleteAccount);




export default router;