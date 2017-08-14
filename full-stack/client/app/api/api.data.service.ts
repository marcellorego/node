import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// import { Pagination, PaginatedResult } from '../pagination';
import { ApiConfigService } from './api.config.service';
// import { DataUtilService } from '../data-util/data-util.service';
import { IResource } from './api.interfaces';

@Injectable()
export class ApiDataService {

  private static readonly PAGINATION_HEADER: string = 'Pagination';

  _baseUrl: string = null;

  constructor(private http: Http,
    // private itemsService: DataUtilService,
    configService: ApiConfigService) {
    this._baseUrl = configService.getApiURI();
  }

  private handleError(error: any): ErrorObservable {
    const applicationError = error.headers.get('Application-Error'),
      serverError = error.json();
    let modelStateErrors: string = null;

    if (!serverError.type) {
      console.log(serverError);
      for (const key in serverError) {
        if (serverError[key]) {
          modelStateErrors += serverError[key] + '\n';
        }
      }
    }

    modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;

    return Observable.throw(applicationError || modelStateErrors || 'Server error');
  }

  protected jwt() {
    // create authorization header with jwt token
    const currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      const headers: Headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
      return new RequestOptions({ headers: headers });
    }
  }

  protected getResourceURI(path: string, resource?: string): string {
    let result = this._baseUrl + path;
    if (resource) {
      result += '/' + resource;
    }
    return result;
  }

  getResource(path: string): Observable<IResource[]> {
    return this.http.get(this.getResourceURI(path))
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  createResource(path: string, data: IResource): Observable<IResource> {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.getResourceURI(path), JSON.stringify(data), {
      headers: headers
    }).map((res: Response) => {
      return res.json();
    }).catch(this.handleError);
  }

  updateResource(path: string, data: IResource): Observable<void> {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.put(this.getResourceURI(path, data.id), JSON.stringify(data), {
      headers: headers
    }).map((res: Response) => {
      return res.json();
    }).catch(this.handleError);
  }

  deleteResource(path: string, id: string): Observable<void> {
    return this.http.delete(this.getResourceURI(path, id))
      .map((res: Response) => {
        return res.json();
      }).catch(this.handleError);
  }

  // getPaginatedResources(path: string, page?: number, itemsPerPage?: number): Observable<PaginatedResult<IResource[]>> {

  //   var peginatedResult: PaginatedResult<IResource[]> = new PaginatedResult<IResource[]>();

  //   let headers = new Headers();
  //   if (page != null && itemsPerPage != null) {
  //     headers.append(DataService.PAGINATION_HEADER, page + ',' + itemsPerPage);
  //   }

  //   return this.http.get(this.getResourceURI(path), {
  //     headers: headers
  //   })
  //     .map((res: Response) => {
  //       console.log(res.headers.keys());
  //       peginatedResult.result = res.json();

  //       let pagination: string = res.headers.get(DataService.PAGINATION_HEADER);

  //       if (pagination != null) {
  //         //var pagination = JSON.parse(res.headers.get("Pagination"));
  //         var paginationHeader: Pagination =
  //           this.itemsService.getSerialized<Pagination>(JSON.parse(pagination));
  //         console.log(paginationHeader);
  //         peginatedResult.pagination = paginationHeader;
  //       }
  //       return peginatedResult;
  //     })
  //     .catch(this.handleError);
  // }
}
