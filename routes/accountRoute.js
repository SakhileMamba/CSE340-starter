//Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const validate = require("../utilities/account-validation")

//Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

//Route to build a register 
router.get("/register", utilities.handleErrors(accountController.buildRegister))

//Route to process the registration of a new account
router.post("/register", validate.registrationRules(), validate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post(
    "/login",
    validate.loginRules(),
    validate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

//Route to build account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

module.exports = router;