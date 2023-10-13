import express from 'express';
import adminController from './admin.controller';
import validateRequestZod from '../../middlewares/validateReqZodMiddleware';
import adminValidation from './admin.validation';

const router = express.Router();

router.post(
  '/create-admin',
  validateRequestZod(adminValidation.createAdminZodSchema),
  adminController.createAdmin
);

router.post(
  '/login',
  validateRequestZod(adminValidation.loginAdminZodSchema),
  adminController.loginAdmin
)

export default router;
