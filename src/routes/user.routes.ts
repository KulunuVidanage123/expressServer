// src/routes/user.routes.ts
import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticateToken } from '../utils/auth';
import { authorizeRoles } from '../middleware/authorizeRoles'; 

const userRouter = Router();

userRouter.post(
  '/register', 
  authenticateToken, 
  authorizeRoles('admin'),
  userController.registerUser
);

userRouter.get(
  '/', 
  authenticateToken, 
  authorizeRoles('admin'), 
  userController.getUsers
);

userRouter.get(
  '/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  userController.getUser
);

userRouter.put(
  '/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  userController.updateUserProfile
);

userRouter.delete(
  '/:id', 
  authenticateToken, 
  authorizeRoles('admin'),
  userController.deleteUserProfile
);

export default userRouter;