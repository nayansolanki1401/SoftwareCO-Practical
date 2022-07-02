const { ROLES } = require('../config/constant');
const roles = [];
const roleRights = new Map();
roleRights.set(roles[0], []);

module.exports = {
	roles,
	roleRights,
};
