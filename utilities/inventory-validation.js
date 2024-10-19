const utilities = require(".")
const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventory-model")
const validate = {}


/*  **********************************
  *  Add Classification Validation Rules
  * ********************************* */
validate.addClassificationRules = () => {
    return [
        //valid classification is required and cannot already exist in the DB
        body("classification_name").trim().escape().notEmpty().matches(/^[A-Z][a-z]*$/).withMessage("Classification name cannot contain spaces, numbers or special characters of any kind. First letter must be capitalized.") //on error message
            .custom(async (classification_name) => {
                const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
                if (classificationExists) {
                    throw new Error("Classification exists. Please try another name.")
                }
            }),

    ]
}


/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.addInventoryRules = () => {
    return [
        body("classification_id").trim().escape()/*.notEmpty()*/
            .isLength({ min: 1 }).withMessage("Please select classification."), //on error message
        //inv_make is required and must be a string
        body("inv_make").trim().escape()/*.notEmpty()*/
            .isLength({ min: 1 }).withMessage("Please provide make."), //on error message
        body("inv_model").trim().escape()/*.notEmpty()*/
            .isLength({ min: 1 }).withMessage("Please provide model."), //on error message
        body("inv_year").trim().escape()/*.notEmpty()*/
            .matches(/^\d{4}$/).withMessage("Please provide year as numeric text."), //on error message
        body("inv_description").trim().escape()/*.notEmpty()*/
            .isLength({ min: 1 }).withMessage("Please provide description."), //on error message
        body("inv_image").trim().escape()/*.notEmpty()*/
            .isLength({ min: 1 }).withMessage("Please provide image."), //on error message
        body("inv_thumbnail").trim().escape()/*.notEmpty()*/
            .isLength({ min: 1 }).withMessage("Please provide thumbnail."), //on error message
        body("inv_price").trim().escape()/*.notEmpty()*/
            .matches(/^[0-9]+(?:\.[0-9]{1,2})?$/).withMessage("Please provide price as positive number that can include up to two decimal places."), //on error message
        body("inv_miles").trim().escape()/*.notEmpty()*/
            .matches(/^\d+$/).withMessage("Please provide miles as integer"), //on error message
        body("inv_color").trim().escape()/*.notEmpty()*/
            .isLength({ min: 1 }).withMessage("Please provide color."), //on error message

        /* body("classification_id", "inv_make", "inv_model", "inv_year", "inv_description", "inv_image", "inv_thumbnail", "inv_price", "inv_miles", "inv_color",)
             .custom(async (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,) => {
                 const vehicleExists = await inventoryModel.checkExistingInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,)
                 if (vehicleExists) {
                     throw new Error("Vehicle exists. Please try different input.")
                 }
             }),*/


    ]
}




/* ******************************
 * Check data and return errors or continue to add new vehicle
 * ***************************** */

validate.checkAddInventoryData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let error = await utilities.buildError()
        classificationsList = await utilities.buildClassificationList()
        res.render("inventory/add-inventory", {
            errors,
            title: "Add New Vehicle",
            nav,
            classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,
            error,
            classificationsList,
        })
        return
    }
    next()
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */

validate.checkAddClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let error = await utilities.buildError()
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name,
            error,
        })
        return
    }
    next()
}

module.exports = validate 
