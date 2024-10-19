const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */

invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    const error = await utilities.buildError()
    let nav = await utilities.getNav()

    const className = /*data[0].classification_name*/ await invModel.getClassificationNameByClassificationId(classification_id)
    res.render("./inventory/classification", { title: className + " vehicles", nav, grid, error })
}

invCont.buildByInventoryId = async function (req, res, next) {
    const inventory_id = req.params.inventoryId
    const data = await invModel.getVehicleByInventoryId(inventory_id)
    const vehicleDisplay = await utilities.buildVehicleDisplay(data)
    const error = await utilities.buildError()
    let nav = await utilities.getNav()
    const vehicleName = data.inv_year + " " + data.inv_make + " " + data.inv_model
    res.render("./inventory/vehicle", { title: vehicleName, nav, vehicleDisplay, error })
}

invCont.buildVehicleManagement = async function (req, res, next) {
    const vehicleManagementlinksList = await utilities.buildVehicleManagementLinksList()
    const error = await utilities.buildError()
    let nav = await utilities.getNav()
    res.render("./inventory/management", { title: "Vehicle Management", nav, vehicleManagementlinksList, error, errors: null })
}

invCont.buildAddClassification = async function (req, res, next) {
    const error = await utilities.buildError()
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", { title: "Add New Classification", nav, error, errors: null })

}

/* ****************************************
*  Add New Classification
* *************************************** */
invCont.addClassification = async function (req, res,) {
    let nav = await utilities.getNav()
    const error = await utilities.buildError()
    const { classification_name } = req.body



    const addClassificationResult = await invModel.addNewClassification(classification_name)

    if (addClassificationResult) {
        nav = await utilities.getNav()
        const vehicleManagementlinksList = await utilities.buildVehicleManagementLinksList()
        req.flash("notice", "Congratulations, you\'ve added a new vehicle classification.")
        res.status(201).render("inventory/management", { title: "Vehicle Management", nav, error, errors: null, vehicleManagementlinksList })
    } else {
        req.flash("notice", "Sorry, adding new vehicle classification failed.")
        res.status(501).render("inventory/add-classification", { title: "Add New Classification", nav, error, errors: null, })
    }
}

invCont.buildAddInventory = async function (req, res, next) {
    classificationsList = await utilities.buildClassificationList()
    const error = await utilities.buildError()
    let nav = await utilities.getNav()
    res.render("./inventory/add-inventory", { title: "Add New Vehicle", nav, classificationsList, error, errors: null })

}

/* ****************************************
*  Add New inventory
* *************************************** */
invCont.addInventory = async function (req, res,) {
    let nav = await utilities.getNav()
    const error = await utilities.buildError()
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body



    const addInventoryResult = await invModel.addNewVehicle(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)

    if (addInventoryResult) {
        nav = await utilities.getNav()
        const vehicleManagementlinksList = await utilities.buildVehicleManagementLinksList()
        req.flash("notice", "Congratulations, you\'ve added a new vehicle to the inventory.")
        res.status(201).render("inventory/management", { title: "Vehicle Management", nav, error, errors: null, vehicleManagementlinksList })
    } else {
        let classificationsList = await utilities.buildClassificationList()
        req.flash("notice", "Sorry, adding new vehicle failed.")
        res.status(501).render("inventory/add-inventory", { title: "Add New Vehicle", nav, error, errors: null, classificationsList })
    }
}

module.exports = invCont