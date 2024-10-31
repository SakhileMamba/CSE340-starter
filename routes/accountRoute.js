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

router.get("/edit/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountEdit))

router.post("/edit/info", utilities.checkLogin, validate.accountInfoUpdateRules(), validate.checkAccountInfoUpdateData, utilities.handleErrors(accountController.updateAccountInfo))

router.post("/edit/password", utilities.checkLogin, validate.accountPasswordUpdateRules(), validate.checkAccountPasswordUpdateData, utilities.handleErrors(accountController.updateAccountPassword))

router.get("/logout", utilities.handleErrors(accountController.logout))

router.get("/userManagement/:admin_account_id", utilities.checkJWTToken, utilities.checkIsAdminAccountType, utilities.handleErrors(accountController.buildUserManagement))

router.get("/delete/:account_id", utilities.checkJWTToken, utilities.checkIsAdminAccountType, utilities.handleErrors(accountController.deleteAccount))


module.exports = router;