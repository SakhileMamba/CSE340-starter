const pool = require("../database")

/* *****************************
*   Register new account
* *************************** */

async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}


/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const email = await pool.query(sql, [account_email])
        return email.rowCount
    } catch (error) {
        return error.message
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
            [account_email])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}

/* *****************************
* Return account data using account id
* ***************************** */
async function getAccountByAccountId(account_id) {
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1',
            [account_id])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching ID found")
    }
}

/* ***************************
 *  Update Account Data
 * ************************** */
async function updateAccountInfo(
    account_firstname,
    account_lastname,
    account_email,
    account_id
) {
    try {
        const sql =
            "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
        const data = await pool.query(sql, [
            account_firstname,
            account_lastname,
            account_email,
            account_id
        ])
        return data.rows[0]
    } catch (error) {
        console.error("model error: " + error)
    }
}

/* ***************************
 *  Update Account Data
 * ************************** */
async function updateAccountPassword(
    account_password,
    account_id
) {
    try {
        console.log(typeof account_id)
        let num = parseInt(account_id)
        console.log(account_id)
        const sql =
            "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
        const data = await pool.query(sql, [
            account_password,
            num
        ])
        console.log(data.rows)
        return data.rows[0]
    } catch (error) {
        console.error("model error: " + error)
    }
}

/* *****************************
* Return all accounts data using except current admin account
* ***************************** */
async function getAllAccountsExpectCurrentAdmin(admin_account_id) {
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id != $1',
            [admin_account_id])
        return result.rows
    } catch (error) {
        return new Error("No finding accounts")
    }
}

/* ***************************
 *  delete Inventory Data
 * ************************** */
async function deleteAccount(account_id) {
    try {
        const sql =
            "DELETE FROM account WHERE account_id = $1"
        const data = await pool.query(sql, [account_id])
        return data
    } catch (error) {
        console.error("Delete Inventory Error")
    }
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountByAccountId, updateAccountInfo, updateAccountPassword, getAllAccountsExpectCurrentAdmin, deleteAccount }