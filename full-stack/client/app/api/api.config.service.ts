import { Injectable } from '@angular/core';
import { GlobalConfig } from '../app.config';

@Injectable()
export class ApiConfigService {

  _serviceURI: string;

  constructor() {
    this._serviceURI = GlobalConfig.getBaseUrl();
  }

  getApiURI() {
    return `${this._serviceURI}/api/`;
  }

  getApiHost() {
    return this._serviceURI;
  }
}
