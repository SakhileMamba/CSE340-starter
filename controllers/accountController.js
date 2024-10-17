const utilities = require("../utilities")


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
    })
}

module.exports = { buildLogin, buildRegister }