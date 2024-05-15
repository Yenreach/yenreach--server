import compression from 'compression';
import http from "http";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import path from 'path'
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { ConnectOptions, connect, set } from 'mongoose';
import {
  NODE_ENV, HOST, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS, DB_URI
} from '@config';
import { dbConnection } from '@/core/databases';
import { Routes } from '@/core/routes/interfaces/RouteInterface';
import { errorMiddleware } from '@/core/middlewares/ErrorMiddleware';
import { logger, stream, registerShutdownHandler } from '@/core/utils';
import './jobs/crons/otp.cron'
import './jobs/crons/wallet.cron'
import './jobs/crons/account.cron'
import './jobs/crons/kyc.cron'
// import { socket } from './customer-support/services/SocketService';


class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public io: any;
  // public io: SocketIO.Server

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = 'production'; NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.connectDatabase()
    // this.initSocket()
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    logger.info('Starting Server ....')

    // const io = new Server(this.createServer(), {
    //   allowRequest: (req, callback) => {
    //     const noOriginHeader = req.headers.origin === undefined;
    //     callback(null, noOriginHeader); // only allow requests without 'origin' header
    //   }
    // })

    // console.log(io)

    // socket(io)

    const server = this.createServer();

    // const server = require('http').createServer(app);
    // const io = new Server(this.createServer())
    // const io = require('socket.io')(server, {
    //   allowRequest: (req: Request, callback: any) => {
    //     // console.log(req.headers.origin)
    //     const noOriginHeader = req.headers.origin === undefined;
    //     callback(null, noOriginHeader);
    //   },
    //   rejectUnauthorized: false,
    //   withCredentials: false,
    //   allowEIO3: true, // false by default
    //   cors: {
    //     origin: "api.morizonweb.com",
    //     // methods: ["GET", "POST"]
    //   }
    // })

    // socket(io)


    // logger.info('========================== Connecting socket ================================')
    // io.on('connection', (socket: any) => {
    //   logger.info('========================== socket io connected! ================================')
    // });

    // global.io = io


    server.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`========= SERVER 🚀=======`);
      logger.info(`========= ENV: ${this.env} ========`);
      logger.info(`========= PORT: ${this.port} ========`);
      logger.info(`🚀 Server running on  ${HOST}:${this.port} 🚀`);
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
    if (this.env !== 'production') {
      set('debug', true);
    }

    return new Promise((resolve, reject) => {
      connect(
        dbConnection.url,
        dbConnection.options as ConnectOptions,
        (error: NativeError) => {
          if (error) {
            logger.error(`Database Error: ${error}`)
            reject(error)
          } else {
            logger.info(`=================================`);
            logger.info(`========= DATABASE 🚀=======`);
            logger.info(`🚀 Database running on ${DB_URI} 🚀`);
            logger.info(`=================================`);

            resolve(undefined)
          }
        },
      )
    })
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
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
