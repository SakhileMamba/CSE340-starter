//Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

//Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//Route to build a register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

module.exports = router;