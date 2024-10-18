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
    (req, res) => {
        res.status(200).send('login process')
    }
)

module.exports = router;