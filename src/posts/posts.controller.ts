import * as express from 'express';
import Post from './post.interface';
import postsModel from './posts.model';

class PostController {
  public path = '/posts';
  public router = express.Router();

  private posts: Post[] = [
    {
      author: 'Marcin',
      content: 'Dolor sit amet',
      title: 'Lorem Ipsum',
    },
  ];
  constructor() {
    this.intializeRoutes();
  }
  public intializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.patch(`${this.path}/:id`, this.modifyPost);
    this.router.delete(`${this.path}/:id`, this.deletePost);
    this.router.post(this.path, this.createPost);
  }
  getAllPosts = async (
    request: express.Request,
    response: express.Response
  ) => {
    const posts = await postsModel.find().exec();
    response.json(posts);
    response.json({ error: 'Something wrong... Sorry' });
  };
  getPostById = async (
    request: express.Request,
    response: express.Response
  ) => {
    const { id } = request.params;
    const post = await postsModel.findById(id);
    response.json(post);
  };
  createPost = async (request: express.Request, response: express.Response) => {
    const post: Post = request.body;
    const postDoc = new postsModel(post);
    const savedPost = await postDoc.save();
    response.json(savedPost);
  };
  modifyPost = async (request: express.Request, response: express.Response) => {
    const { id } = request.params;
    const postData: Post = request.body;
    const updatedData = await postsModel.findByIdAndUpdate(id, postData, {
      new: true,
    });
    response.json(updatedData);
  };
  deletePost = async (request: express.Request, response: express.Response) => {
    const { id } = request.params;
    const deletedPost = await postsModel.findByIdAndDelete(id);
    if (deletedPost) {
      response.status(200).json(deletedPost);
    } else {
      response.status(404).json({ message: `Not found Id: ${id}` });
    }
  };
}

export default PostController;
