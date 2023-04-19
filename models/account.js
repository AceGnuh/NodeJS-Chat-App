const mongoose = require('mongoose')

var accountSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    }
})

var Account = new mongoose.model('Account', accountSchema)

module.exports = Account