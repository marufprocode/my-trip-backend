import express from 'express';
import usersRoutes from '../modules/users/users.routes';
import authRoutes from '../modules/auth/auth.routes';
import cowRoutes from '../modules/cow/cow.routes';
import ordersRoutes from '../modules/orders/orders.routes';
import adminRoutes from '../modules/admin/admin.routes';

const router = express.Router();

const appRoutes = [
  {
    path: '/users',
    route: usersRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/cows',
    route: cowRoutes,
  },
  {
    path: '/orders',
    route: ordersRoutes,
  },
  {
    path: '/admins',
    route: adminRoutes,
  },
];

appRoutes.forEach(route => router.use(route.path, route.route));

export default router;
