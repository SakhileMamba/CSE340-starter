const utilities = require("../utilities/")
const errorController = {}

errorController.buildError = async function (req, res) {
    //throw new Error('Throw makes it go boom!')
    const error = await utilities.buildError()
    res.render("errors/error", { title: "Error", error })
}

module.exports = errorController