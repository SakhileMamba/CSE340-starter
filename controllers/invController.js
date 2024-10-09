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
    const className = data[0].classification_name
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

module.exports = invCont