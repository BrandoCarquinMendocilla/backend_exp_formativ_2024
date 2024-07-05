const { registerUser } = require('../../validate/user-validate');
const express = require('express');
const router = express.Router();
const user = require('../user');
const otp = require('../otp');
const Combos = require('../combos');
const propuesta = require('../propuesta');

// Sesion
router.post('/create/user', user.createUser);
router.post('/validate/user', user.validateUserEmail);
router.post('/login', user.loginUser);
router.post('/google-login', user.googleLoginUser);

router.delete('/logout', user.logOut);
router.post('/change/paswword', user.changePassword);

router.post('/private/validate/user', user.validateUser);

router.post('/send/mail/otp', otp.sendMailOtp);
router.post('/valid/otp', otp.validOtp);


router.get('/get/combos', Combos.getCombos);

module.exports = router;
