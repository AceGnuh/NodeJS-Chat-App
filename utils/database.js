const mongoose = require("mongoose")

const credential = require("../credentials.js")

const connection = function() {
    mongoose.set("strictQuery", false)

    mongoose.connect(credential.mongo.connectionString)
        .then(() => console.log('Connected to database successfully'))
        .catch(error => console.log(error))
}

module.exports = connection