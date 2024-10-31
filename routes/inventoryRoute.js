//Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const validate = require("../utilities/inventory-validation")

//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

//Route to build a specific inventory item detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId))

//Route to vehicle management view
router.get("/vehicleManagement", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.buildVehicleManagement))

router.get("/addClassification", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification))

router.post("/addClassification", utilities.checkJWTToken, utilities.checkAccountType, validate.addClassificationRules(), validate.checkAddClassificationData, utilities.handleErrors(invController.addClassification))

router.get("/addInventory", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory))

router.post("/addInventory", utilities.checkJWTToken, utilities.checkAccountType, validate.addInventoryRules(), validate.checkAddInventoryData, utilities.handleErrors(invController.addInventory))

router.get("/getInventory/:classification_id", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.getInventoryJSON))

//route to build view to edit invetory
router.get("/edit/:inventory_id", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.buildInventoryEdit))

//route to update inventory item
router.post("/update", utilities.checkJWTToken, utilities.checkAccountType, validate.addInventoryRules(), validate.checkUpdateInventoryData, utilities.handleErrors(invController.updateInventory))

//route to build inventory deletion confirmation view
router.get("/delete/:inventory_id", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.buildInventoryDelete))

//route to delete inventory item
router.post("/delete", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.deleteInventory))



module.exports = router;