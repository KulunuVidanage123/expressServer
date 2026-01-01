import { Router } from 'express';
import * as userController from '../controllers/user.controller';

const userRouter = Router();

userRouter.post('/register', userController.registerUser); 
userRouter.get('/', userController.getUsers);             
userRouter.get('/:id', userController.getUser);      
userRouter.put('/:id', userController.updateUserProfile); 
userRouter.delete('/:id', userController.deleteUserProfile);


// Protected Routes (will require auth middleware later)
// userRouter.put('/:id', authMiddleware, userController.updateUserProfile);
// userRouter.delete('/:id', authMiddleware, userController.deleteUserProfile);

export default userRouter;