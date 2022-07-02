const express = require('express');
const publicRoute = require('./public.route');
const adminRoute = require('../../api/admin/admin.route')

const router = express.Router();

router.use('/', publicRoute);
router.use('/admin', adminRoute);

module.exports = router;
