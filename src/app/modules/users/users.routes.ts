import express from 'express';
import usersController from './users.controller';
import checkAuth from '../../middlewares/checkAuth';
import { ENUM_USER_ROLE } from '../../../shared/enums/usersEnum';
import userProfileController from '../user-profile/userProfile.controller';
import validateRequestZod from '../../middlewares/validateReqZodMiddleware';
import userProfileValidation from '../user-profile/userProfileValidation';

const router = express.Router();
router.get('/my-profile', checkAuth(), userProfileController.getMyProfile);
router.get('/profiles', checkAuth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), userProfileController.getAllProfile);
router.get('/my-profile/:id', checkAuth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), userProfileController.getProfileById);
router.patch('/my-profile', checkAuth(), validateRequestZod(userProfileValidation.profileUpdateValidation), userProfileController.updateMyProfile);
router.patch('/my-profile/:id', checkAuth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), validateRequestZod(userProfileValidation.profileUpdateValidation), userProfileController.updateMyProfile);

router.post('/create', checkAuth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), usersController.createUser);
router.get('/', checkAuth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), usersController.getAllUsers);
router.get('/:id', checkAuth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), usersController.getSignleUsers);
router.patch('/:id', checkAuth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), usersController.updateUser);
router.delete('/:id', checkAuth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), usersController.deleteUser);

export default router;
