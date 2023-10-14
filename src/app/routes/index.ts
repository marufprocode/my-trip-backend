import express from 'express';
import usersRoutes from '../modules/users/users.routes';
import authRoutes from '../modules/auth/auth.routes';
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
    path: '/admins',
    route: adminRoutes,
  },
];

appRoutes.forEach(route => router.use(route.path, route.route));

export default router;
