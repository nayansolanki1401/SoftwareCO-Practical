const Joi = require('@hapi/joi');
const { ROLES } = require('../../config/constant');

const register = {
	body: Joi.object().keys({
		password: Joi.string().required().messages({
			'string.empty': 'Password cannot be empty.'
		}),
		firstName: Joi.string().required().messages({
			'string.empty': 'fullName cannot be empty.'
		}),
		lastName: Joi.string().required().messages({
			'string.empty': 'fullName cannot be empty.'
		}),
		userName: Joi.string().required().messages({
			'string.empty': 'fullName cannot be empty.'
		}),
		roleId: Joi.string().required().messages({
			'string.empty': 'roleId cannot be empty.'
		}),
		email: Joi.string().email().required().messages({
			'string.email': 'Are you sure you entered the valid email address?',
			'string.empty': 'Email address cannot be empty.'
		}),
	})
}

const login = {
	body: Joi.object().keys({
		email: Joi.string().email().required().messages({
			'string.email': 'Are you sure you entered the valid email address?',
			'string.empty': 'Email address cannot be empty.'
		}),
		password: Joi.string().required().messages({
			'string.empty': 'Password cannot be empty.'
		})
	}),
};

const addRole = {
	body: Joi.object().keys({
		roleName: Joi.string().required().messages({
			'string.empty': 'Password cannot be empty.'
		}),
		accessModule: Joi.array().required().messages({
			'array.empty': 'accessModule cannot be empty.'
		}),
		active: Joi.boolean().required().messages({
			'boolean.empty': 'active cannot be empty.'
		}),
	}),
};

const editRole = {
	params: Joi.object().required().keys({
		roleId: Joi.string().required().messages({
			'string.empty': 'roleId cannot be empty.'
		}),
	}),
	body: Joi.object().keys({
		roleName: Joi.string(),
		accessModule: Joi.array(),
		active: Joi.boolean()
	}),
};

const getRole = {
};

const deleteRole = {
	params: Joi.object().required().keys({
		roleId: Joi.string().required().messages({
			'string.empty': 'roleId cannot be empty.'
		}),
	}),
};
const addAccessModule = {
	params: Joi.object().required().keys({
		roleId: Joi.string().required().messages({
			'string.empty': 'roleId cannot be empty.'
		}),
	}),
	body: Joi.object().keys({
		moduleName: Joi.string().required().messages({
			'string.empty': 'accessModule cannot be empty.'
		})
	}),
};
const removeAccessModule = {
	params: Joi.object().required().keys({
		roleId: Joi.string().required().messages({
			'string.empty': 'roleId cannot be empty.'
		}),
	}),
	body: Joi.object().keys({
		moduleName: Joi.string().required().messages({
			'string.empty': 'accessModule cannot be empty.'
		})
	}),
};

const getUserList = {
	query: Joi.object().keys({
		search: Joi.string()
	}),
}

const editUser = {
	params: Joi.object().required().keys({
		userId: Joi.string().required().messages({
			'string.empty': 'roleId cannot be empty.'
		}),
	}),
	body: Joi.object().keys({
		roleName: Joi.string(),
		accessModule: Joi.array(),
		active: Joi.boolean()
	}),
};

const deleteUser = {
	params: Joi.object().required().keys({
		userId: Joi.string().required().messages({
			'string.empty': 'roleId cannot be empty.'
		}),
	}),
};
module.exports = {
	register,
	login,
	addRole,
	getRole,
	editRole,
	deleteRole,
	addAccessModule,
	removeAccessModule,
	editUser,
	deleteUser,
	getUserList
};