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
router.get("/vehicleManagement", utilities.handleErrors(invController.buildVehicleManagement))

router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification))

router.post("/addClassification", validate.addClassificationRules(), validate.checkAddClassificationData, utilities.handleErrors(invController.addClassification))

router.get("/addInventory", utilities.handleErrors(invController.buildAddInventory))

router.post("/addInventory", validate.addInventoryRules(), validate.checkAddInventoryData, utilities.handleErrors(invController.addInventory))

module.exports = router;