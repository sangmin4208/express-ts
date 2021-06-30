import express from 'express';
import Controller from './interfaces/controller.interface';
import mongoose from 'mongoose';
class App {
  public app: express.Application;
  constructor(controllers: Controller[]) {
    this.app = express();
    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
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
