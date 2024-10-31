const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()


const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */

Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list += '<a href="/inv/type/' + row.classification_id + '" title="See our inventory of ' + row.classification_name + ' vehicles">' + row.classification_name + "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        return '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the vehicle display view HTML
* ************************************ */
Util.buildVehicleDisplay = async function (data) {
    let display =
        `  
            <img id="info-img" src="${data.inv_image}" alt="${data.inv_year} ${data.inv_make} ${data.inv_model}">
            <div id="text_info">
                <h2>${data.inv_make} ${data.inv_model} Details</h2>
                <p class="info price"><span class="label">Price:</span> $${new Intl.NumberFormat('en-US').format(data.inv_price)}</p>
                <p class="info"><span class="label">Description:</span> ${data.inv_description}</p>
                <p class="info"><span class="label">Color:</span> ${data.inv_color}</p>
                <p class="info"><span class="label">Miles:</span> ${new Intl.NumberFormat('en-US').format(data.inv_miles)}</p>
            </div>
        `

    return display
}

Util.buildError = async function () {

    return `<a href="/error">Error Link</a>`
}

Util.buildVehicleManagementLinksList = async function () {

    return `<ul id="vehicleManagementLinksList">
        <li><a href="/inv/addClassification">Add New Classification</a></li>
        <li><a href="/inv/addInventory">Add New Vehicle</a></li>
    </ul>`
}


Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
        '<select name="classification_id" id="classification_id" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                next()
            })
    } else {
        next()
    }
}

/* ****************************************
* Middleware to check account type
**************************************** */
Util.checkAccountType = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                } else {
                    if (accountData.account_type === "Admin" || accountData.account_type === "Employee") {
                        next()
                    }
                    else {
                        req.flash("notice", "You do not have the authorization to do that. Log into an administrative account")
                        res.clearCookie("jwt")
                        return res.redirect("/account/login")
                    }
                }

            })
    } else {
        req.flash("notice", "Please log in.")
        res.clearCookie("jwt")
        return res.redirect("/account/login")
    }



    /*const account_type = res.locals.accountData.account_type

    if (account_type === "Employee" || account_type === "Admin") {
        next()
    } else {
        req.flash("notice", "You do not have the authorization to do that. Log into an administrative account")
        res.clearCookie("jwt")
        return res.redirect("/account/login")
    }*/
}


/* ****************************************
* Middleware to check if account type is admin
**************************************** */
Util.checkIsAdminAccountType = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                } else {
                    if (accountData.account_type === "Admin") {
                        next()
                    }
                    else {
                        req.flash("notice", "You do not have the authorization. You must be an Administrator to do that.")
                        return res.redirect("/account/")
                    }
                }

            })
    } else {
        req.flash("notice", "Please log in.")
        res.clearCookie("jwt")
        return res.redirect("/account/login")
    }

}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in")
        return res.redirect("/account/login")
    }
}

// Build accounts items into HTML table components and inject into DOM 
Util.buildAccountsList = (data) => {
    // Set up the table labels 
    let dataTable = '<thead>';
    dataTable += '<tr><th>ID</th><th>Full Name</th><th>Email</th><th>Type</th><th>Action</th></tr>';
    dataTable += '</thead>';
    // Set up the table body 
    dataTable += '<tbody>';
    // Iterate over all vehicles in the array and put each in a row 
    data.forEach(function (element) {
        dataTable += `<tr><td>${element.account_id}</td>`;
        dataTable += `<td>${element.account_firstname} ${element.account_lastname}</td>`;
        dataTable += `<td>${element.account_email}</td>`;
        dataTable += `<td>${element.account_type}</td>`;
        dataTable += `<td><a href='/account/delete/${element.account_id}' title='Click to delete'>Delete</a></td></tr>`;
    })
    dataTable += '</tbody>';
    // Display the contents in the Inventory Management view 
    return `<table id="users-table" class="span2">${dataTable}</table>`;
}

module.exports = Util