const express = require('express');
const validate = require('../../middlewares/validate');
const adminValidation = require('./admin.validation');
const adminController = require('./admin.controller');
const router = express.Router();
const auth = require('../../middlewares/auth')

// ******************************  AUTHENTICATION RELATED APIs ************************************ //

router.post('/register', validate(adminValidation.register), adminController.register);
router.post('/login', validate(adminValidation.login), adminController.login);


// ******************************  Role RELATED APIs ************************************ //

router.post('/addrole', validate(adminValidation.addRole), adminController.addRole);
router.get('/getrole', validate(adminValidation.getRole), adminController.getRole);
router.put('/editrole/:roleId', validate(adminValidation.editRole), adminController.editRole);
router.delete('/deleterole/:roleId', validate(adminValidation.deleteRole), adminController.deleteRole);


// Add a functionality to update list of access modules like adding payment module access to specific user and removing the same
router.put('/addaccessmodule/:roleId', validate(adminValidation.addAccessModule), adminController.addAccessModule);
router.put('/removeaccessmodule/:roleId', validate(adminValidation.removeAccessModule), adminController.removeAccessModule);


// Add a functionality to update list of access modules like adding payment module access to specific user and removing the same
router.get('/checkaccess/:roleId', adminController.checkAccess);

//Add a functionality to update many users with same data. Ex. update all user lastname to "modul"
router.put('/updatemanyuser', adminController.updateManyUser);

//a functionality to update many users with different data. Ex. change one users's firstName, another's access modules and email in same dbb call
router.put('/updatemanyuserdifferent', adminController.updateManyUserDifferent);

// ******************************  User RELATED APIs ************************************ //

router.get('/getuserlist', validate(adminValidation.getUserList), adminController.getUserList); //With search functionality
router.put('/edituser/:userId', validate(adminValidation.editUser), adminController.editUser);
router.delete('/deleteuser/:userId', validate(adminValidation.deleteUser), adminController.deleteUser);

// **************************** For Authenticated user *************************************//

router.put('/auth/edituser', auth(), adminController.editUser);
router.delete('/auth/deleteuser', auth(), adminController.deleteUser);



module.exports = router;
