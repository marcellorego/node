import * as debug from 'debug';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as morgan from 'morgan';
import * as path from 'path';
import * as errorHandler from 'errorHandler';
import * as methodOverride from 'method-override';
import { factory } from './logging';
import { EventEmitter } from 'events';
import { DBFactory, IDatabase } from './db/dbFactory';
import DBError from './db/dbError';

// import { IndexRoute } from './routes/index';

const LOGGER = factory.getLogger('Application');

/**
 * The app server.
 *
 * @class Application
 */
export class Application extends EventEmitter {

  public static TERMINATE = 'TERMINATE';

  private eventEmitter = new EventEmitter();
  private readonly name: string;
  private dbConnection: any;
  private database: IDatabase;

  public express: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Application
   * @method bootstrap
   * @static
   * @return Returns the newly created injector for this app.
   */
  public static bootstrap(name: string): Application {
    LOGGER.info(`Booting ${name} ...`);
    return new Application(name);
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  private constructor(name: string) {

    super();

    // application name
    this.name = name;

    // create expressjs application
    this.express = express();

    // configure application
    this.config();

    // configure database
    this.configDB();
  }

  private onDBConnected(): void {
    // add api
    this.api();

    // add routes
    this.routes();

    // error handling
    this.handleErrors();
  }

  /**
   * Create REST API routes
   *
   * @class Server
   * @method api
   */
  private api(): void {
    const router: express.Router = express.Router();

    // AuthRoute.create(router);

    // use router middleware
    this.express.use('/api', router);
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  private config(): void {
    // add static paths
    this.express.use(express.static(path.join(__dirname, '../public')));

    // configure view engine
    if (process.env.VIEW_ENGINE) {
      this.express.set('views', path.join(__dirname, 'views'));
      this.express.set('view engine', 'pug');
    }

    // logging
    this.express.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      next();
      LOGGER.info(`Request ${req.method} ${req.path} ${res.statusCode}`);
    });

    // mount morgan logger
    this.express.use(morgan('dev'));

    // mount json form parser
    this.express.use(bodyParser.json());

    // mount query string parser
    this.express.use(bodyParser.urlencoded({
      extended: true
    }));

    // mount cookie parser
    this.express.use(cookieParser(process.env.SECRET_COOKIE));

    // mount override?
    this.express.use(methodOverride());

    //  catch 404 and forward to error handler
    this.express.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      LOGGER.error(`error => ${err}`);
      err.status = 404;
      next(err);
      // res.sendFile(path.join(__dirname, '../public/index.html'));
    });

  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  private configDB(): void {
    LOGGER.info(`Configuring database connection`);
    this.database = DBFactory.getDB();
    this.dbConnection = this.database.connect(() => {
      LOGGER.info(`Database connected`);
      this.onDBConnected();
    }, (error: DBError) => {
      this.emit(Application.TERMINATE, error);
    });
  }

  /**
   * Create and return Router.
   *
   * @class Server
   * @method config
   * @return void
   */
  private routes(): void {
    const router: express.Router = express.Router();

    // IndexRoute
    // IndexRoute.create(router, __dirname);

    // use router middleware
    this.express.use(router);
  }

  private handleErrors(): void {
    // error handling
    this.express.use(errorHandler());
  }

  public disconnetDB(): void {
    this.database.disconnet(this.dbConnection);
  }
}
