
const mongoose = require('mongoose');
const { pick } = require('lodash');
var Schema = mongoose.Schema;
const roleeScheeema = mongoose.Schema(
    {
        roleName: {
            type: String
        },
        accessModule:{
            type: Array
        },
        active:{
            type: Boolean
        }
    },
    {
        timestamps: true,
        toObject: { getters: true },
        toJSON: { getters: true },
    },
);


const roleData = mongoose.model('role', roleeScheeema);

module.exports = roleData;