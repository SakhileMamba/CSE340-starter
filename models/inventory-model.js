const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */

async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `
            SELECT * FROM public.inventory AS i
            JOIN public.classification AS C
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1
            `, [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationbyid error" + error)
    }

}

async function getClassificationNameByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `
            SELECT classification_name FROM classification
            WHERE classification_id = $1
            `, [classification_id]
        )
        return data.rows[0].classification_name
    } catch (error) {
        console.error("getClassificationNameByClassificationId error" + error)
    }

}

async function getVehicleByInventoryId(inventory_id) {
    try {
        const data = await pool.query(
            `
            SELECT * FROM public.inventory
            WHERE inv_id = $1
            `, [inventory_id]
        )
        return data.rows[0]
    } catch (error) {
        console.error("getinventorybyid error" + error)
    }
}

/* **********************
 *   Check for existing classification
 * ********************* */
async function checkExistingClassification(classification_name) {
    try {
        const sql = "SELECT * FROM classification WHERE classification_name = $1"
        const classification = await pool.query(sql, [classification_name])
        return classification.rowCount
    } catch (error) {
        return error.message
    }
}

/* *****************************
*   Add new classification
* *************************** */

async function addNewClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        return await pool.query(sql, [classification_name])
    } catch (error) {
        return error.message
    }
}

/* **********************
 *   Check for existing vehicle
 * ********************* */
async function checkExistingInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
    try {
        const sql = `SELECT * FROM inventory WHERE classification_id = $1 AND inv_make = $2 AND inv_model = $3 AND inv_year = $4 AND inv_description = $5 AND inv_image = $6 AND inv_thumbnail = $7 AND inv_price = $8 AND inv_miles = $9 AND inv_color = $10`
        const classification = await pool.query(sql, [classification_id, inv_make, inv_model, inv_year, rinv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color])
        console.error(classification)
        return classification.rowCount
    } catch (error) {
        return error.message
    }
}

/* *****************************
*   Add new classification
* *************************** */

async function addNewVehicle(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
    try {
        const sql = "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
        return await pool.query(sql, [classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color])
    } catch (error) {
        return error.message
    }
}



module.exports = { getClassifications, getInventoryByClassificationId, getVehicleByInventoryId, checkExistingClassification, addNewClassification, addNewVehicle, checkExistingInventory, getClassificationNameByClassificationId };