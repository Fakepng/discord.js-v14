const { model, Schema, modelNames } = require('mongoose');

module.exports = model('Infractions', new Schema({
    Guild: String,
    User: String,
    Infractions: Array
}))