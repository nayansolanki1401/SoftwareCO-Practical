const catchAsync = require('../../utils/catchAsync');
const createResponse = require('../../utils/response');
const Messages = require('../../utils/messages');
const adminService = require('./admin.service')
const httpStatus = require('http-status')
const bcrypt = require('bcrypt');
const TokenModel = require('../../models/tokens.model')
const UserModel = require('../../models/user.model');
// ****************************** AUTHENTICATION RELATED API *********************************************

const login = catchAsync(async (req, res) => {
	let { email, password } = req.body;
	const user = await adminService.login(email, password);
	const tokens = await adminService.generateAuthTokens(user._id, user.role);
	const response = { user: user.transform(), tokens };
	createResponse(res, httpStatus.OK, Messages.LOGIN, response)
});

const register = catchAsync(async (req, res) => {
	const UserData = await adminService.register(req.body)
	createResponse(res, httpStatus.OK, Messages.REGISTER, UserData)
})


//  ****************************** Role Module RELATED CRUD API *********************************************
const addRole = catchAsync(async (req, res) => {
	const RoleData = await adminService.addRole(req)
	createResponse(res, httpStatus.OK, Messages.ROLE_ADDED, RoleData)
})

const getRole = catchAsync(async (req, res) => {
	const RoleData = await adminService.getRole()
	createResponse(res, httpStatus.OK, Messages.ROLE_LIST, RoleData)
})

const editRole = catchAsync(async (req, res) => {
	const RoleData = await adminService.editRole(req.params.roleId, req.body)
	createResponse(res, httpStatus.OK, Messages.ROLE_EDIT, RoleData)
})

const deleteRole = catchAsync(async (req, res) => {
	const RoleData = await adminService.deleteRole(req.params.roleId)
	createResponse(res, httpStatus.OK, Messages.ROLE_DELETE, {})
})


// Add a functionality to update list of access modules like adding payment module access to specific user and removing the same

const addAccessModule = catchAsync(async (req, res) => {
	const RoleData = await adminService.addAccessModule(req.params.roleId, req.body.moduleName)
	createResponse(res, httpStatus.OK, Messages.ROLE_ACCESS__ADDED, {})
})

const removeAccessModule = catchAsync(async (req, res) => {
	const RoleData = await adminService.removeAccessModule(req.params.roleId, req.body.moduleName)
	createResponse(res, httpStatus.OK, Messages.ROLE_ACCESS_REMOVE, {})
})

const checkAccess = catchAsync(async (req, res) => {
	const RoleData = await adminService.checkAccess(req.params.roleId, req.body.moduleName)
	if (RoleData) {
		createResponse(res, httpStatus.OK, Messages.ROLE_ACCESS_TRUE, {})
	}
	else {
		createResponse(res, httpStatus.OK, Messages.ROLE_ACCESS_FALSE, {})
	}

})
const updateManyUser = catchAsync(async (req, res) => {
	const UserData = await adminService.updateManyUser(req.body)
	createResponse(res, httpStatus.OK, Messages.UPDATE_MANY, UserData)
})

const updateManyUserDifferent = catchAsync(async (req, res) => {
	const UserData = await adminService.updateManyUserDifferent(req.body)
	createResponse(res, httpStatus.OK, Messages.UPDATE_MANY_COND, UserData)
})

//  ****************************** User Module RELATED CRUD API *********************************************

const getUserList = catchAsync(async (req, res) => {
	const UserData = await adminService.getUserList(req)
	createResponse(res, httpStatus.OK, Messages.USER_LIST, UserData)
})

const editUser = catchAsync(async (req, res) => {
	const UserData = await adminService.editUser(req.params.userId, req.body)
	createResponse(res, httpStatus.OK, Messages.USER_EDIT, UserData)
})

const deleteUser = catchAsync(async (req, res) => {
	const UserData = await adminService.deleteUser(req.params.userId)
	createResponse(res, httpStatus.OK, Messages.USER_DELETE, UserData)
})

// ************************************* User CRUD for Authenticated user  *******************************//
const editUserAuth = catchAsync(async (req, res) => {
	const UserData = await adminService.editUser(req.user.id, req.body)
	createResponse(res, httpStatus.OK, Messages.USER_EDIT, UserData)
})

const deleteUserAuth = catchAsync(async (req, res) => {
	const UserData = await adminService.deleteUser(req.user.id)
	createResponse(res, httpStatus.OK, Messages.USER_DELETE, UserData)
})

module.exports = {
	login,
	register,
	addRole,
	getRole,
	editRole,
	deleteRole,
	getUserList,
	editUser,
	deleteUser,
	editUserAuth,
	deleteUserAuth,
	addAccessModule,
	removeAccessModule,
	checkAccess,
	updateManyUser,
	updateManyUserDifferent
};
