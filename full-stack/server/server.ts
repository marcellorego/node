import * as http from 'http';
import { Socket } from 'net';
import { Request, Response, NextFunction } from 'express';
import { Application } from './application';
import { factory } from './logging';

const LOGGER = factory.getLogger('Server');

/**
 * The http server.
 *
 * @class Server
 */
export class Server {

  private sockets: Array<Socket> = [];
  private httpPort: any;
  private httpServer: http.Server;
  private app: Application;

  public shuttingDown = false;

  constructor() {}

  public run() {

    const appName: string = process.env.APP_NAME;

    // Start the server
    LOGGER.info(`Initializing server for "${appName}"`);

    // create http server
    this.httpPort = this.normalizePort(process.env.PORT || 3000);

    // bootstrap application server
    this.app = Application.bootstrap(appName);
    this.app.on(Application.TERMINATE, (error) => this.onError(error));

    const expressApp = this.app.express;
    expressApp.set('port', this.httpPort);
    expressApp.use((req, resp, next) => this.responseShuttingDown(req, resp, next));

    this.httpServer = http.createServer(expressApp);

    // listen on provided ports
    this.httpServer.listen(this.httpPort);

    // add error handler
    this.httpServer.on('error', (error) => this.onError(error));

    // start listening on port
    this.httpServer.on('listening', () => this.onListening());

    this.httpServer.on('close', () => this.onClose());

    this.httpServer.on('connection', (socket) => this.onConnection(socket));

    process.on('SIGINT', () => this.cleanup('SIGINT'));
    process.on('SIGTERM', () => this.cleanup('SIGTERM'));
  }

  /**
   * Normalize a port into a number, string, or false.
   */
  private normalizePort(val: any) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  /**
   * Event listener for HTTP server 'error' event.
   */
  private onError(error: any) {

    if (error.syscall !== 'listen') {
      LOGGER.error('error', error);
      throw error;
    }

    const bind = typeof this.httpPort === 'string'
      ? 'Pipe ' + this.httpPort
      : 'Port ' + this.httpPort;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        LOGGER.error(bind + ' requires elevated privileges');
        this.shuttDown(1);
        break;
      case 'EADDRINUSE':
        LOGGER.error(bind + ' is already in use');
        this.shuttDown(1);
        break;
      case 'MongoError':
        LOGGER.error(error.message);
        this.shuttDown(1);
        break;
      default:
        LOGGER.error('error', error);
        throw error;
    }
  }

  /**
   * Event listener for HTTP server 'listening' event.
   */
  private onListening() {
    const addr: any = this.httpServer.address();
    const bindPort: string = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    LOGGER.info('Server is listening on ' + bindPort);
  }

  private onClose() {
    LOGGER.info('End!');
  }

  private onConnection(socket: Socket) {
    LOGGER.info(`onConnection ${socket.remoteAddress}:${socket.remotePort}`);
    this.sockets.push(socket);
  }

  private shuttDown(code: number) {

    if (!this.shuttingDown) {
      LOGGER.info('Closing server ...');

      this.shuttingDown = true;

      LOGGER.info('Closing out database connections.');
      this.app.disconnetDB();

      // Manually destroy all the connections.
      if (this.sockets && this.sockets.length) {
          LOGGER.info(`Closing remaining ${this.sockets.length} connection(s)...`);
          this.sockets.forEach((socket: Socket) => {
              socket.destroy();
          });
      }

      LOGGER.info(`Shutting down server with code ${code}`);
      this.httpServer.close(() => process.exit(code));
    }
  }

  private cleanup(event: string) {
    LOGGER.info(`cleanup ${event} ${this.shuttingDown}`);
    this.shuttDown(0);
  }

  private responseShuttingDown(req: Request, resp: Response, next: NextFunction) {
    if (!this.shuttingDown) {
        return next();
    }

    resp.setHeader('Connection', 'close');
    resp.status(503).send({error: 'Server is shutting down!'});
    // Change the response to something your client is expecting:
    // html, text, json, etc.
  }

}
