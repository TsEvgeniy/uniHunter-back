const { Router } = require('express');
const companyController = require('../controllers/companyController');
const { requireAuth, checkCompany } = require('../middlewares/authMiddlewares');

const router = Router();

router.post('/company/signup', companyController.signup_post);
router.post('/company/login', companyController.login_post);
router.get('/company/logout', companyController.logout_get);

router.put('/company/update-profile', requireAuth, checkCompany, companyController.profile_update);

module.exports = router;