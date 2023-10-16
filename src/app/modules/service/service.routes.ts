import express from 'express';
import checkAuth from '../../middlewares/checkAuth';
import { ENUM_USER_ROLE } from '../../../shared/enums/usersEnum';
import createService from './controllers/createService';
import deleteService from './controllers/deleteService';
import getAllService from './controllers/getAllService';
import getServiceById from './controllers/getServiceById';
import updateService from './controllers/updateService';

const router = express.Router();

router.post('/', checkAuth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), createService);
router.get('/', checkAuth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), getAllService);
router.get('/:id', checkAuth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), getServiceById);
router.patch('/:id', checkAuth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), updateService);
router.delete('/:id', checkAuth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), deleteService);

export default router;
