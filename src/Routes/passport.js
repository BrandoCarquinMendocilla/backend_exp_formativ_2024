const passport = require('passport');
const express = require('express');
const router = express.Router();
require('dotenv').config();


module.exports = router;

router.get("/", passport.authenticate("google", ["profile", "email"]));

router.get(
	"/callback",
	passport.authenticate("google", {
		successRedirect: '/auth/google/success',
		failureRedirect: "/auth/google/failed",
	})
);

router.get("/success", (req, res) => {
	if (req.user) {
		res.status(200).json({
			error: false,
			message: "Successfully Loged In",
			user: req.user,
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});


router.get("/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

