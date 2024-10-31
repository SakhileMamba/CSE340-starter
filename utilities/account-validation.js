const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}


/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () => {
    return [
        //firstname is required and must be a string
        body("account_firstname").trim().escape()/*.notEmpty()*/
            .isLength({ min: 1 }).withMessage("Please provide first name."), //on error message
        //lastname is required and be a string
        body("account_lastname").trim().escape()/*.notEmpty()*/
            .isLength({ min: 2 }).withMessage("Please provide a last name."), //on error message
        //valid email is required and cannot already exist in the DB
        body("account_email").trim().escape()/*.notEmpty()*/.isEmail()
            .normalizeEmail().withMessage("A valid email is required.") //on error message
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists. Please log in or use a different email.")
                }
            }),
        //Password is required and must be strong
        body("account_password").trim()/*.notEmpty()*/
            .isStrongPassword({ minLength: 12, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, }).withMessage("Password does not meet requirements."), //on error message

    ]
}

/*  **********************************
  *  Account Info Update Data Validation Rules
  * ********************************* */
validate.accountInfoUpdateRules = () => {
    return [
        //firstname is required and must be a string
        body("account_id"),
        body("account_firstname").trim().escape()/*.notEmpty()*/
            .isLength({ min: 1 }).withMessage("Please provide first name."), //on error message
        //lastname is required and be a string
        body("account_lastname").trim().escape()/*.notEmpty()*/
            .isLength({ min: 2 }).withMessage("Please provide a last name."), //on error message
        //valid email is required and cannot already exist in the DB
        body("account_email").trim().escape()/*.notEmpty()*/.isEmail()
            .normalizeEmail().withMessage("A valid email is required.") //on error message
            /*.custom(async (account_email) => {

                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email already in use.")
                }
            })*/,
    ]
}

/*  **********************************
  *  Account Password Update Data Validation Rules
  * ********************************* */
validate.accountPasswordUpdateRules = () => {
    return [
        //Password is required and must be strong
        body("account_password").trim()/*.notEmpty()*/
            .isStrongPassword({ minLength: 12, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, }).withMessage("Password does not meet requirements."), //on error message

    ]
}

/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
    return [
        //valid email is required and cannot already exist in the DB
        body("account_email").trim().escape()/*.notEmpty()*/.isEmail()
            .normalizeEmail().withMessage("A valid email is required.") //on error message
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (!emailExists) {
                    throw new Error("Email does not exist. Please register or use a different email.")
                }
            }),
        //Password is required and must be strong
        body("account_password").trim()/*.notEmpty()*/
            .isStrongPassword({ minLength: 12, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, }).withMessage("Password does not meet requirements."), //on error message

    ]
}



/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */

validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let error = await utilities.buildError()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
            error,
        })
        return
    }
    next()
}

/* ******************************
 * Check info data and return errors or continue to info update
 * ***************************** */

validate.checkAccountInfoUpdateData = async (req, res, next) => {
    const { account_id, account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let error = await utilities.buildError()
        res.render("account/edit-account", {
            errors,
            title: "Edit Account",
            nav,
            account_id,
            account_firstname,
            account_lastname,
            account_email,
            error,
        })
        return
    }
    next()
}

/* ******************************
 * Check password data and return errors or continue to password update
 * ***************************** */

validate.checkAccountPasswordUpdateData = async (req, res, next) => {
    const { account_password } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let error = await utilities.buildError()
        res.render("account/edit-account", {
            errors,
            title: "Edit Account",
            nav,
            error,
        })
        return
    }
    next()
}

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */

validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let error = await utilities.buildError()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
            error,
        })
        return
    }
    next()
}

module.exports = validate 
