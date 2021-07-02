import express from 'express';
import Controller from './interfaces/controller.interface';
import mongoose from 'mongoose';
import errorMiddleware from './middleware/error.middleware';
import cookieParser from 'cookie-parser';

class App {
  public app: express.Application;
  constructor(controllers: Controller[]) {
    this.app = express();
    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cookieParser());
  }
  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }
  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }
  private connectToTheDatabase() {
    const { MONGO_DB_URI } = process.env;
    mongoose
      .connect(MONGO_DB_URI as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
      })
      .catch((err) => {
        console.log(`MongoDB connect error: ${err}`);
        process.exit(1);
      });
  }
}

export default App;
