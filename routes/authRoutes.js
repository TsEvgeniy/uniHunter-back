const { Router } = require('express');
const authController = require('../controllers/authController');
const { requireAuth, checkUser } = require('../middlewares/authMiddlewares');

const router = Router();

router.get('/user/signup', authController.signup_get);
router.post('/user/signup', authController.signup_post);
router.get('/user/login', authController.login_get);
router.post('/user/login', authController.login_post);
router.get('/user/logout', authController.logout_get);

router.put('/user/update-profile', requireAuth, checkUser, authController.update_profile);



module.exports = router;