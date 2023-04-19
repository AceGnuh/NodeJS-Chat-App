const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    userId1: {
        type: String,
        required: true,
    },
    userId2: {
        type: String,
        required: true,
    },
    message: {
        type: String,
    }
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message