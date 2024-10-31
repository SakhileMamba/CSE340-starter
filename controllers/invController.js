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
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", { title: "Vehicle Management", nav, classificationSelect, vehicleManagementlinksList, error, errors: null })
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

/* ****************************************
*  Build Add New inventory view
* *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
    const classificationsList = await utilities.buildClassificationList()
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
        const classificationSelect = await utilities.buildClassificationList()
        const vehicleManagementlinksList = await utilities.buildVehicleManagementLinksList()
        req.flash("notice", "Congratulations, you\'ve added a new vehicle to the inventory.")
        res.status(201).render("inventory/management", { title: "Vehicle Management", nav, error, errors: null, vehicleManagementlinksList, classificationSelect })
    } else {
        let classificationsList = await utilities.buildClassificationList()
        req.flash("notice", "Sorry, adding new vehicle failed.")
        res.status(501).render("inventory/add-inventory", { title: "Add New Vehicle", nav, error, errors: null, classificationsList })
    }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}


/* ***************************
 *  Build update/edit inventory view
 * ************************** */
invCont.buildInventoryEdit = async function (req, res, next) {
    const inventory_id = parseInt(req.params.inventory_id)
    let nav = await utilities.getNav()
    const error = await utilities.buildError()
    const itemData = await invModel.getVehicleByInventoryId(inventory_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        error,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    })
}


/* ****************************************
*  Update inventory item
* *************************************** */
invCont.updateInventory = async function (req, res,) {
    let nav = await utilities.getNav()
    const error = await utilities.buildError()
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body

    const updateResult = await invModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    )

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/inv/vehicleManagement")
    } else {
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationSelect: classificationSelect,
            error,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
    }
}


/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.buildInventoryDelete = async function (req, res, next) {
    const inventory_id = parseInt(req.params.inventory_id)
    let nav = await utilities.getNav()
    const error = await utilities.buildError()
    const itemData = await invModel.getVehicleByInventoryId(inventory_id)

    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/delete-confirm", {
        title: "Delete " + itemName,
        nav,
        error,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_price: itemData.inv_price,
    })
}

/* ****************************************
*  Delete inventory item
* *************************************** */
invCont.deleteInventory = async function (req, res,) {
    let nav = await utilities.getNav()
    const error = await utilities.buildError()
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_price,
    } = req.body


    const updateResult = await invModel.deleteInventory(parseInt(inv_id))

    if (updateResult) {
        const itemName = inv_make + " " + inv_model
        req.flash("notice", `The ${itemName} was successfully deleted.`)
        res.redirect("/inv/vehicleManagement")
    } else {

        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the delete failed.")
        res.status(501).render("inventory/delete-confirm", {
            title: "Delete " + itemName,
            nav,
            error,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_price,
        })
    }
}

module.exports = invCont