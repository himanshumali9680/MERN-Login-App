import { Router } from 'express';
const router = Router();

/**import all controllers */
import * as controller from '../controllers/appController.js';
import { registerMail } from '../controllers/mailer.js';
import Auth, { localVaricables } from '../middleware/auth.js';



/** POST Methods */
router.route('/register').post(controller.register);
//router.route('/register').post((req, res) => res.json('register route'));
router.route('/registerMail').post(registerMail);
router.route('/authenticate').post((req, res) => res.end());
router.route('/login').post(controller.verifyUser,controller.login);

/**GET Methods */
router.route('/user/:username').get(controller.getUser)
router.route('/generateOTP').get(controller.verifyUser, localVaricables, controller.generateOTP)
router.route('/verifyOTP').get( controller.verifyOTP)
router.route('/createResetSession').get(controller.createResetSession)

/**Put Methods */
router.route('/updateuser').put(Auth, controller.updateUser);
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword);

export default router; 