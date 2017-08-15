import * as refereces from 'json-refs';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { factory } from '../logging';
import InitializationError from '../exceptions/initializationError';

const LOGGER = factory.getLogger('YAMLResolver');

export default class YAMLResolver {

  private _resolver;

  constructor() {
    this._resolver = refereces.resolveRefs;
  }

  public resolveRefs(apiPath: string, defaults: any = null): Promise<any> {
    if (!fs.existsSync(apiPath)) {
      return Promise.reject(new InitializationError('NOYAMLDEF', `No such file or directory ${apiPath}`));
    }
    const _content: string = fs.readFileSync(apiPath).toString();
    const _root: any = yaml.safeLoad(_content);
    const _options: any = {
      filter: ['relative', 'remote'],
      loaderOptions: {
        processContent: function (res, callback) {
          const loaded: any = yaml.safeLoad(res.text);
          callback(null, loaded);
        }
      }
    };
    return new Promise((resolve, reject) => {
      return this._resolver(_root, _options)
        .then((result: any) => {
          Object.assign(result.resolved, defaults);
          resolve(result);
        }).catch((error: Error) => {
          reject(error);
        });
    });
  }
}
