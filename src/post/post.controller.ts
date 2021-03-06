import * as express from 'express';
import { NextFunction } from 'express-serve-static-core';
import Post from './post.interface';
import postModel from './post.model';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDto from './post.dto';
import authMiddleware from '../middleware/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';

class PostController {
  public path = '/posts';
  public router = express.Router();
  private post = postModel;
  constructor() {
    this.intializeRoutes();
  }
  public intializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(
        `${this.path}/:id`,
        validationMiddleware(CreatePostDto, true),
        this.modifyPost
      )
      .delete(`${this.path}/:id`, this.deletePost)
      .post(
        this.path,
        authMiddleware,
        validationMiddleware(CreatePostDto),
        this.createPost
      );
  }
  getAllPosts = async (
    request: express.Request,
    response: express.Response
  ) => {
    const posts = await this.post.find().populate('author', '-password');
    response.json(posts);
  };
  getPostById = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction
  ) => {
    const { id } = request.params;
    const post = await this.post.findById(id);
    if (post) {
      response.json(post);
    } else {
      next(new PostNotFoundException(id));
    }
  };
  createPost = async (request: RequestWithUser, response: express.Response) => {
    const postData: Post = request.body;
    const createdPost = new this.post({
      ...postData,
      author: request.user._id,
    });
    const savedPost = await createdPost.save();
    await savedPost.populate('author', '-password').execPopulate();
    response.json(savedPost);
  };
  modifyPost = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction
  ) => {
    const { id } = request.params;
    const postData: Post = request.body;
    const updatedData = await this.post.findByIdAndUpdate(id, postData, {
      new: true,
    });
    if (updatedData) {
      response.json(updatedData);
    } else {
      next(new PostNotFoundException(id));
    }
  };
  deletePost = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction
  ) => {
    const { id } = request.params;
    const deletedPost = await this.post.findByIdAndDelete(id);
    if (deletedPost) {
      response.json(deletedPost);
    } else {
      next(new PostNotFoundException(id));
    }
  };
}

export default PostController;
