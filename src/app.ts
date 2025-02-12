import compression from 'compression';
import http from "http";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import path from 'path'
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
// import { ConnectOptions, connect, set } from 'mongoose';
import { AppDataSource } from './core/databases';
import { Routes } from './core/routes/interfaces/RouteInterface';
import { errorMiddleware } from './core/middlewares/ErrorMiddleware';
import { logger, stream, registerShutdownHandler } from './core/utils';
import env from './config/env.config';
// import { socket } from './customer-support/services/SocketService';
// import './jobs/crons/email.cron'


class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public io: any;
  // public io: SocketIO.Server

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = env.NODE_ENV || 'development';
    // this.env = 'production'; // NODE_ENV || 'development';
    this.port = env.PORT || 3000;

    this.connectDatabase()
    // this.initSocket()
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    logger.info('Starting Server ....')

    const server = this.createServer();


    server.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`========= SERVER 🚀=======`);
      logger.info(`========= ENV: ${this.env} ========`);
      logger.info(`========= PORT: ${this.port} ========`);
      logger.info(`🚀 Server running on  ${env.HOST}:${this.port} 🚀`);
      logger.info(`=================================`);

    });;

    return server
  }

  public createServer() {
    return http.createServer(this.getServer())
  }

  public getServer() {
    return this.app;
  }

  private async connectDatabase() {
    // if (this.env !== 'production') {
    //   set('debug', true);
    // }

    return new Promise((resolve, reject) => {
      AppDataSource.initialize()
        .then(() => {
          logger.info(`=================================`);
          logger.info(`========= DATABASE 🚀=======`);
          logger.info(`🚀 Database running 🚀`);
          logger.info(`=================================`);
          console.log(AppDataSource.options.entities);
          resolve(undefined)
        })
        .catch((err) => {
          logger.error(`Database Error: ${err}`)
          reject(err)
        })
      // connect(
      //   dbConnection.url,
      //   dbConnection.options as ConnectOptions,
      //   (error: NativeError) => {
      //     if (error) {
      //       logger.error(`Database Error: ${error}`)
      //       reject(error)
      //     } else {
      //       logger.info(`=================================`);
      //       logger.info(`========= DATABASE 🚀=======`);
      //       logger.info(`🚀 Database running on ${DB_URI} 🚀`);
      //       logger.info(`=================================`);

      //       resolve(undefined)
      //     }
      //   },
      // )
    })
  }

  private initializeMiddlewares() {
    this.app.use(morgan(env.LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: '*' }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json({ limit: "15mb" }));
    this.app.use(express.urlencoded({ limit: "15mb", extended: true }));
    this.app.use(express.static(path.join(__dirname, '../public')));

    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    logger.info('Initializing Routes ....')

    routes.forEach(route => {
      this.app.use('/api/v1', route.router);
    });


    logger.info('Routes Initialized Successfully ✔️')

  }

  private initializeSwagger() {
    logger.info('Initializing Swagger ....')

    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

    logger.info('Swagger Initialized Successfully ✔️')
  }

  private stopServer(): Promise<void> {
    logger.info('Stopping HTTP Server ❌')

    return new Promise((resolve, reject) => {
      this.listen().close(error => {
        if (error) {
          reject(error)
        } else {
          resolve(undefined)
        }
      })
    })
  }

  private initializeErrorHandling() {
    logger.info('Initializing Error Handler ....')

    this.app.use(errorMiddleware);

    registerShutdownHandler(this.stopServer)

    logger.info('Error Handler Initialized Successfully ✔️')

  }

}

export default App;
