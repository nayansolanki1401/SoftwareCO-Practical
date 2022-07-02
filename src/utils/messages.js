class Messages {
	static LOGIN = 'You have successfully logged in';
	static REGISTER = "Registered Successfully";
	static ALREADY_USER = "Account with given email already exist"
	static EMAIL_ALREADY = "account with same email already exist, please provide different data"
	static ROLE_ADDED = "Role addeed successfully";
	static ROLE_LIST = "Role List fetched successfully";
	static ALREADY_ROLE = "Role already defined, please check role list"
	static ROLE_EDIT = "Role Edit success"
	static ROLE_DELETE = "Role Deleted Success"
	static ROLE_ACCESS_TRUE = "Have access"
	static ROLE_ACCESS_FALSE = "Don't have access"

	static EMAIL_NOT_FOUND = "User not found for given email address, please check your email address"

	static UPDATE_MANY = "Update many functionality"
	static UPDATE_MANY_COND = "Update many with condition"
	static USER_NOT_FOUND = "User not found"
	static ROLE_NOT_FOUND = "Role not found"
}

module.exports = Messages;
