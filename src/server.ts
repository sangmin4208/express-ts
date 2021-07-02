import App from './app';
import PostController from './posts/posts.controller';
import validateEnv from './utils/validateEnv';
import AuthenticationController from './authentication/authentication.controller';
validateEnv();
const app = new App([new PostController(), new AuthenticationController()]);
app.listen();
