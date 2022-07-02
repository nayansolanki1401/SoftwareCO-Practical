
const mongoose = require('mongoose');
const { pick } = require('lodash');
var Schema = mongoose.Schema;
const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String
        },
        roleId: {
            type: Schema.Types.ObjectId,
            default: null,
            ref: 'roles'
        },
    },
    {
        timestamps: true,
        toObject: { getters: true },
        toJSON: { getters: true },
    },
);

userSchema.methods.transform = function () {
    const user = this;
    return pick(user.toJSON(), ['id', 'fullName', 'email', "roleId"]);
};

const userData = mongoose.model('user', userSchema);

module.exports = userData;