const utilities = require("../utilities/")
const errorController = {}

errorController.buildError = async function (req, res) {
    //throw new Error('Throw makes it go boom!')
    const error = await utilities.buildError()
    const nav = await utilities.getNav()

    res.render("errors/error", { title: "500", nav, error, message: 'Oh no! There was a crash. Maybe try a different route?' })
}

module.exports = errorController