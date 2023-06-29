const { Router } = require('express');
const companyController = require('../controllers/companyController');

const router = Router();

router.post('/company/signup', companyController.signup_post);
router.post('/company/login', companyController.login_post);
router.get('/company/logout', companyController.logout_get);

module.exports = router;