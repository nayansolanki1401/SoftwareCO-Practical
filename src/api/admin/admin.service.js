const moment = require('moment');
const config = require('../../config/config');
const tokenService = require('../common/token.service');
const { TOKEN_TYPE } = require('../../config/constant');
const UserModel = require('../../models/user.model');
const RoleModel = require('../../models/role.model')
const Messages = require('../../utils/messages');
const AppError = require('../../utils/AppError')
const mongoose = require('mongoose')
const httpStatus = require('http-status')
const bcrypt = require('bcrypt');

// ********************************* Auth related api ************************** //
const register = async (body) => {
	const alreadyUser = await getUserByEmail(body.email)
	if (alreadyUser) {
		throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.ALREADY_USER)
	}
	body.password = await bcrypt.hash(body.password, 8);
	const userData = await UserModel.create(body)
	return userData
}

const login = async (email, password) => {
	let user = await UserModel.findOne({ email: email })
	console.log('user :', user)
	if (user) {
		await checkPassword(password, user.password);
		return user
	}
	else {
		console.log('In Else Part')
		throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.EMAIL_NOT_FOUND);
	}
};

const generateAuthTokens = async (userId, role) => {
	const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
	const accessToken = tokenService.generateToken(userId, role, accessTokenExpires);
	const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
	const refreshToken = tokenService.generateToken(userId, role, refreshTokenExpires);
	await tokenService.saveToken(refreshToken, userId, refreshTokenExpires, TOKEN_TYPE.REFRESH_TOKEN);

	return {
		access: {
			token: accessToken,
			expires: accessTokenExpires.toDate(),
		},
		refresh: {
			token: refreshToken,
			expires: refreshTokenExpires.toDate(),
		},
	};
};

const checkPassword = async (password, correctPassword) => {
	const isPasswordMatch = await bcrypt.compare(password, correctPassword);
	if (!isPasswordMatch) {
		throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.PASSWORD_NOT_MATCH);
	}
};

const getUserByEmail = async (email) => {
	let user = await UserModel.findOne({ email: email });
	return user;
};

// ***************************** Role Related CRUD ******************************* //

const addRole = async (req) => {
	const alreadyRole = await RoleModel.findOne({ roleName: req.body.roleName })
	if (alreadyRole) {
		throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.ALREADY_ROLE)
	}
	const RoleData = await RoleModel.create(req.body)
	return RoleData

}

const getRole = async () => {
	return await RoleModel.find();
}

const editRole = async (roleId, body) => {
	const roleData = await RoleModel.findById(roleId);
	if (roleData) {
		if (roleData.roleName === body.roleName) {
			return await RoleModel.findByIdAndUpdate(roleId, body, { new: true })
		}
		else {
			const alreadyRole = await RoleModel.findOne({ roleName: body.roleName })
			if (!alreadyRole) {
				return await RoleModel.findByIdAndUpdate(roleId, body, { new: true });
			}
			else {
				throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.ALREADY_ROLE)
			}
		}
	}
}

const deleteRole = async (roleId) => {
	const Role = await RoleModel.findById(roleId)
	if (Role) {
		return await RoleModel.findByIdAndDelete(roleId);
	} else {
		throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.ROLE_NOT_FOUND)
	}


}


// Add a functionality to update list of access modules like adding payment module access to specific user and removing the same

const addAccessModule = async (roleId, moduleName) => {
	const Role = await RoleModel.findById(roleId)
	if (Role) {
		return await RoleModel.findByIdAndUpdate(roleId, { $push: { accessModule: moduleName } }, { new: true })
	} else {
		throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.ROLE_NOT_FOUND)
	}

}

const removeAccessModule = async (roleId, moduleName) => {
	const Role = await RoleModel.findById(roleId)
	if (Role) {
		return await RoleModel.findByIdAndUpdate(roleId, { $pull: { accessModule: moduleName } }, { new: true })
	} else {
		throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.ROLE_NOT_FOUND)
	}

}

const checkAccess = async (roleId, moduleName) => {
	const Role = await RoleModel.findById(roleId)
	if (Role) {
		return await RoleModel.findOne({ _id: roleId, accessModule: moduleName })
	} else {
		throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.ROLE_NOT_FOUND)
	}
}

const updateManyUser = async (body) => {
	return await UserModel.updateMany(body.cond, body.data, { new: true })
}

const updateManyUserDifferent = async (body) => {
	console.log('Daya :', body)
	body.data.forEach(async element => {
		if (element.data.email) {
			const user = await getUserByEmail(element.data.email)
			if (!user) {
				await UserModel.findByIdAndUpdate(element.id, { $set: element.data }, { new: true })
			}
		} else {
			await UserModel.findByIdAndUpdate(element.id, { $set: element.data }, { new: true })
		}

	});
	return true
}

// ***************************** User Related CRUD ******************************* //

const getUserList = async (req) => {
	let { search } = req.query;
	let searchfilter = {};
	const searchFields = ["username"];
	if (search) {
		searchfilter["$or"] = searchFields.map((field) => ({
			[field]: { $regex: search, $options: "i" },
		}));
	}
	const userData = await UserModel.aggregate(
		[
			{
				'$lookup': {
					'from': 'roles',
					'let': {
						'roleId': '$roleId'
					},
					'pipeline': [
						{
							'$match': {
								'$expr': {
									'$eq': [
										'$_id', '$$roleId'
									]
								}
							}
						}, {
							'$project': {
								'roleName': 1,
								'accessModule': 1
							}
						}
					],
					'as': 'result'
				}
			}, {
				'$unwind': {
					'path': '$result',
					'preserveNullAndEmptyArrays': true
				}
			}, {
				'$project': {
					'firstName': 1,
					'lastName': 1,
					'userName': 1,
					'email': 1,
					'roleName': '$result.roleName',
					'accessModule': '$result.accessModule'
				}
			},
			{
				$match: searchfilter
			}
		]
	)
	return userData
}

const editUser = async (userId, body) => {
	const user = await UserModel.findById(userId)
	if (user) {
		return await UserModel.findByIdAndUpdate(userId, body, { new: true })
	} else {
		throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.USER_NOT_FOUND)
	}
}

const deleteUser = async (userId) => {
	const user = await UserModel.findById(userId)
	if (user) {
		return await UserModel.findByIdAndDelete(userId)
	} else {
		throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.USER_NOT_FOUND)
	}
}

module.exports = {
	generateAuthTokens,
	login,
	checkPassword,
	getUserByEmail,
	register,
	addRole,
	getRole,
	editRole,
	deleteRole,
	addAccessModule,
	removeAccessModule,
	checkAccess,
	getUserList,
	editUser,
	deleteUser,
	updateManyUser,
	updateManyUserDifferent
};