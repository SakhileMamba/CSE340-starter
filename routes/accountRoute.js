//Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

//Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

//Route to build a register 
router.get("/register", utilities.handleErrors(accountController.buildRegister))

//Route to process the registration of a new account
router.post("/register", utilities.handleErrors(accountController.registerAccount))

module.exports = router;