const { builtinModules } = require('module');
const mongoose = require('mongoose');

let thingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        validate: {
            validator: function(str) {
                return str != "";
            }
        }
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return value > 0;
            }
        }
    },
    imageUrl: {
        type: String,
        required: false
    },
    user: {
        type: String,
        ref: 'Users'
    }
});

module.exports = mongoose.model('Things', thingSchema);