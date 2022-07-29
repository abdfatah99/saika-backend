import express from 'express';
import Auth from '../auth/auth.js'

import userController from '../controller/user.controller.js'

const router = express.Router()

router
    .route('/register') // host:/user/register
    .post(userController.userRegister)

router
    .route('/login') // host:/user/login
    .post(userController.userLogin) // protect

    // login mechanism
    // user can login with id&pass or user can use token

router
    .route('/:userId')
    .delete(userController.deleteUser)

export default router;