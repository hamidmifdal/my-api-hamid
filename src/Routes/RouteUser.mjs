import { Router } from 'express'
import * as Controllers from '../Controllers/UserController.mjs'
import authenticateToken from '../Middlewares/auth.mjs'
import _protected from '../Middlewares/protected.mjs'

const router = Router()

router.post("/user",Controllers.CreateUser);
router.get("user/:id",Controllers.GetUser);
router.post('/login',Controllers.Signin);
router.get('/protected',authenticateToken ,_protected)
// router.get('/profile',authenticateToken, Controllers.Profile)


export default router;