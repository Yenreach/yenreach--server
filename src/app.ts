import compression from 'compression';
import http from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import path from 'path';
import morgan from 'morgan';
import swaggerJSDoc, { SwaggerDefinition } from 'swagger-jsdoc';
import swaggerUi, { SwaggerOptions, SwaggerUiOptions } from 'swagger-ui-express';
import AppDataSource from './core/database';
import { Routes } from './core/routes/interfaces/RouteInterface';
import { errorMiddleware } from './core/middlewares/ErrorMiddleware';
import { logger, stream, registerShutdownHandler } from './core/utils';
import env from './config/env.config';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import z from 'zod';
extendZodWithOpenApi(z);
import { swaggerSpecs } from './config';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public io: any;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = env.NODE_ENV || 'development';
    this.port = env.PORT || 3000;
    this.connectDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    logger.info('Starting Server ....');
    const server = this.createServer();

    server.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`========= SERVER 🚀=======`);
      logger.info(`========= ENV: ${this.env} ========`);
      logger.info(`========= PORT: ${this.port} ========`);
      logger.info(`🚀 Server running on  ${env.DB_HOST}:${this.port} 🚀`);
      logger.info(`=================================`);
    });

    return server;
  }

  public createServer() {
    return http.createServer(this.getServer());
  }

  public getServer() {
    return this.app;
  }

  private async connectDatabase() {
    return new Promise((resolve, reject) => {
      AppDataSource.initialize()
        .then(() => {
          logger.info(`=================================`);
          logger.info(`========= DATABASE 🚀=======`);
          logger.info(`🚀 Database running 🚀`);
          logger.info(`=================================`);
          // console.log(AppDataSource.options.entities);
          resolve(undefined);
        })
        .catch(err => {
          logger.error(`Database Error: ${err}`);
          reject(err);
        });
    });
  }

  private initializeMiddlewares() {
    this.app.use(morgan(env.LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: '*' }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json({ limit: '15mb' }));
    this.app.use(express.urlencoded({ limit: '15mb', extended: true }));
    this.app.use(express.static(path.join(__dirname, '../public')));

    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    logger.info('Initializing Routes ....');

    routes.forEach(route => {
      this.app.use('/api/v1', route.router);
    });

    logger.info('Routes Initialized Successfully ✔️');
  }

  private initializeSwagger() {
    logger.info('Initializing Swagger ....');
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
    logger.info('Swagger Initialized Successfully ✔️');
  }

  private stopServer(): Promise<void> {
    logger.info('Stopping HTTP Server ❌');

    return new Promise((resolve, reject) => {
      this.listen().close(error => {
        if (error) {
          reject(error);
        } else {
          resolve(undefined);
        }
      });
    });
  }

  private initializeErrorHandling() {
    logger.info('Initializing Error Handler ....');

    this.app.use(errorMiddleware);

    registerShutdownHandler(this.stopServer);

    logger.info('Error Handler Initialized Successfully ✔️');
  }
}

export default App;
