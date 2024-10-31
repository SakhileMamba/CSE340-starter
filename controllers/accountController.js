const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


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



/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const error = await utilities.buildError()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            error,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        }
        else {
            req.flash("message notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                error,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
}

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildAccountManagement(req, res, next) {
    let nav = await utilities.getNav()
    const error = await utilities.buildError()
    res.render("account/", {
        title: "Account Management",
        nav,
        error,
        errors: null,
    })
}

/* ****************************************
*  Deliver account edit view
* *************************************** */
async function buildAccountEdit(req, res, next) {
    const account_id = parseInt(req.params.account_id)
    let nav = await utilities.getNav()
    const error = await utilities.buildError()
    const itemData = await accountModel.getAccountByAccountId(account_id)
    res.render("./account/edit-account", {
        title: "Edit Account",
        nav,
        error,
        errors: null,
        account_id: itemData.account_id,
        account_firstname: itemData.account_firstname,
        account_lastname: itemData.account_lastname,
        account_email: itemData.account_email,
    })
}

/* ****************************************
*  Update account info
* *************************************** */
async function updateAccountInfo(req, res, next) {
    let nav = await utilities.getNav()
    const error = await utilities.buildError()
    const {
        account_firstname,
        account_lastname,
        account_email,
        account_id
    } = req.body

    const accountData = await accountModel.getAccountByAccountId(account_id)
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (emailExists && (accountData.account_email !== account_email)) {
        //throw new Error("Email already in use.")
        req.flash("notice", "Email already in use.")
        res.status(501).render("./account/edit-account", {
            title: "Edit Account",
            nav,
            error,
            errors: null,
            account_id,
            account_firstname,
            account_lastname,
            account_email,
        })
    } else {
        const updateResult = await accountModel.updateAccountInfo(
            account_firstname,
            account_lastname,
            account_email,
            account_id,
        )

        if (updateResult) {
            console.log(res.locals.accountData)
            res.locals.accountData.account_firstname = req.body.account_firstname
            req.flash("notice", `Your account was successfully updated.`)
            res.redirect("/account/")
        } else {

            req.flash("notice", "Sorry, the update failed.")
            res.status(501).render("account/edit-account", {
                title: "Edit Account",
                nav,
                error,
                errors: null,
                account_id,
                account_firstname,
                account_lastname,
                account_email,
            })
        }
    }
}

/* ****************************************
*  Update account password
* *************************************** */
async function updateAccountPassword(req, res, next) {
    let nav = await utilities.getNav()
    const error = await utilities.buildError()
    const {
        account_id,
        account_password
    } = req.body

    let hashedPassword
    try {
        //regular passed and cost(salt is generated automatically)
        hashedPassword = bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", "Sorry, there was an error processing the password update.")
        req.status(500).render("account/edit-account", {
            title: "Edit Account",
            nav,
            error,
            errors: null,
        })
    }

    const updateResult = await accountModel.updateAccountPassword(
        hashedPassword,
        account_id
    )

    if (updateResult) {

        req.flash("notice", `Your password was successfully updated.`)
        res.redirect("/account/")
    } else {

        req.flash("notice", "Sorry, the password update failed.")
        res.status(501).render("account/edit-account", {
            title: "Edit Account",
            nav,
            error,
            errors: null,
        })
    }
}

/* ****************************************
*  Logout
* *************************************** */
async function logout(req, res, next) {
    let nav = await utilities.getNav()
    const error = await utilities.buildError()
    res.clearCookie("jwt")
    res.redirect("/")
}

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildUserManagement(req, res, next) {
    const admin_account_id = parseInt(req.params.admin_account_id)
    let nav = await utilities.getNav()
    const error = await utilities.buildError()
    const itemData = await accountModel.getAllAccountsExpectCurrentAdmin(admin_account_id)
    const accountsTable = await utilities.buildAccountsList(itemData)
    res.render("./account/manage-users", {
        title: "Manage Users",
        nav,
        error,
        errors: null,
        accountsTable
    })
}

/* ****************************************
*  Delete account
* *************************************** */
async function deleteAccount(req, res,) {
    const account_id = parseInt(req.params.account_id)
    let nav = await utilities.getNav()
    const error = await utilities.buildError()

    const updateResult = await accountModel.deleteAccount(parseInt(account_id))

    if (updateResult) {
        const itemData = await accountModel.getAllAccountsExpectCurrentAdmin(res.locals.accountData.account_id)
        const accountsTable = await utilities.buildAccountsList(itemData)
        req.flash("notice", `The account was successfully deleted.`)
        res.status(200).render("account/manage-users", {
            title: "Manage Users ",
            nav,
            error,
            errors: null,
            accountsTable

        })
    } else {

        const itemData = await accountModel.getAllAccountsExpectCurrentAdmin(res.locals.accountData.account_id)
        const accountsTable = await utilities.buildAccountsList(itemData)
        req.flash("notice", "Sorry, the delete failed.")
        res.status(501).render("account/manage-users", {
            title: "Manage Users ",
            nav,
            error,
            errors: null,
            accountsTable

        })
    }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildAccountEdit, updateAccountInfo, updateAccountPassword, logout, buildUserManagement, deleteAccount }