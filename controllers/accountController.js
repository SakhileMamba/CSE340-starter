const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    const error = await utilities.buildError()
    res.render("account/login", {
        title: "Login",
        nav,
        error,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    const error = await utilities.buildError()
    res.render("account/register", {
        title: "Register",
        nav,
        error,
        errors: null,
    })
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const error = await utilities.buildError()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    //Hash the password before storing
    let hashedPassword
    try {
        //regular passed and cost(salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", "Sorry, there was an error processing the registration.")
        req.status(500).render("account/register", {
            title: "Registration",
            nav,
            error,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword)

    if (regResult) {
        req.flash("notice", `Congratulations, you\'re registered ${account_firstname}. Please log in`)
        res.status(201).render("account/login", { title: "Login", nav, error, errors: null, })
    } else {
        req.flash("notice", "Sorry the registration failed.")
        res.status(501).render("account/register", { title: "Registration", nav, error, errors: null, })
    }

}


module.exports = { buildLogin, buildRegister, registerAccount }