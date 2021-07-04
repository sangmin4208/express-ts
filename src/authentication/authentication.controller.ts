import express from 'express';
import Controller from '../interfaces/controller.interface';
import userModel from '../users/user.model';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../users/user.dto';
import AuthenticationService from './authentication.service';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private service = new AuthenticationService();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDto),
      this.registration
    );
    // this.router.post(
    //   `${this.path}/login`,
    //   validationMiddleware(LogInDto),
    //   this.loggingIn
    // );
    this.router.post(`${this.path}/logout`, this.loggingOut);
  }

  private registration = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: CreateUserDto = request.body;
    const { cookie, user } = await this.service.register(userData);
    response.setHeader('Set-Cookie', cookie);
    response.send(user);
  };

  // private loggingIn = async (
  //   request: express.Request,
  //   response: express.Response,
  //   next: express.NextFunction
  // ) => {
  //   const loginData: LogInDto = request.body;
  //   const user = await this.user.findOne({ email: loginData.email });
  //   if (user) {
  //     const isPasswordMatching = await bcrypt.compare(
  //       loginData.password,
  //       user.get('password', null, { getters: false })
  //     );
  //     if (isPasswordMatching) {
  //       const tokenData = this.createToken(user);
  //       response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
  //       response.send(user);
  //     } else {
  //       next(new WrongCredentialsException());
  //     }
  //   } else {
  //     next(new WrongCredentialsException());
  //   }
  // };
  private loggingOut = (
    request: express.Request,
    response: express.Response
  ) => {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    response.send(200);
  };
}
export default AuthenticationController;
