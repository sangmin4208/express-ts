import Controller from '../interfaces/controller.interface';
import authMiddleware from '../middleware/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import express, { Request, Response, NextFunction } from 'express';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import postModel from '../post/post.model';
import UserNotFoundException from '../exceptions/UserNotFoundException';
import userModel from './user.model';

class UserController implements Controller {
  public path = '/users';
  public router = express.Router();

  private post = postModel;
  private user = userModel;
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, authMiddleware, this.getUserById);
    this.router.get(
      `${this.path}/:id/posts`,
      authMiddleware,
      this.getAllPostsOfUser
    );
  }

  private getUserById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id = request.params.id;
    const userQuery = this.user.findById(id);
    if (request.query.withPosts === 'true') {
      userQuery.populate('posts').exec();
    }
    const user = await userQuery;
    if (user) {
      response.send(user);
    } else {
      next(new UserNotFoundException(id));
    }
  };

  private getAllPostsOfUser = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ) => {
    const userId = request.params.id;
    if (userId === request.user._id.toString()) {
      const posts = await this.post.find({ author: userId });
      response.send(posts);
    } else {
      next(new NotAuthorizedException());
    }
  };
}
export default UserController;
