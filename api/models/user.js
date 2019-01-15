const mongoose = require('mongoose');

// make sure to use the mongoose.Schema.whatever when designating the schema
const userSchema = mongoose.Schema({
            _id: mongoose.Schema.Types.ObjectId,
            email: {
                type: String,
                required: true,
                unique: true,
                match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                },
                password: {
                    type: String,
                    required: true
                }
            });

        // We want to export the schema wrapped in a model that contains our schema
        // Model takes two arguments, the name we want to use ('uppercase convention'), and the schema
        module.exports = mongoose.model('User', userSchema);