const { builtinModules } = require('module');
const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Users', userSchema);