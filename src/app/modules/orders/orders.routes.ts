import express from 'express';
import ordersController from './orders.controller';
import checkAuth from '../../middlewares/checkAuth';
import { ENUM_USER_ROLE } from '../../../shared/enums/usersEnum';

const router = express.Router();

router.post('/', checkAuth(ENUM_USER_ROLE.BUYER), ordersController.createOrder);
router.get('/', checkAuth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER), ordersController.getAllOrders);
router.get('/:id', checkAuth(), ordersController.getSingleOrder);


export default router;
