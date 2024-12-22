import express from "express";
const router = express.Router();
import { register, login ,tracker, calculator, getUser, updateApiKey} from "../controller/userController.js";
import auth from "../middleware/auth.js";

router.post("/tracker", auth, tracker)
router.post("/calculate-food-stats", auth, calculator);
router.get("/get-user", auth, getUser);
router.post('/update-api-key', auth, updateApiKey);
router.post("/register", register);
router.post("/login", login);

export default router;
