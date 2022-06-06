import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {constant} from '../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {
  }

  GET(url): Promise<any> {
    return this.http.get(constant.serverURL + url).pipe(tap(result => {
      console.log(`GET API: ${url}, DATA:`, result);
    })).toPromise();
  }

  POST(url, data): Promise<any> {
    return this.http.post(constant.serverURL + url, data).pipe(tap(result => {
      console.log(`POST API: ${url}, DATA: `, result);
    })).toPromise();
  }

  PUT(url, data): Promise<any> {
    return this.http.put(constant.serverURL + url, data).pipe(tap(result => {
      console.log(`PUT API: ${url}, DATA: `, result);
    })).toPromise();
  }

  PATCH(url, data = null): Promise<any> {
    return this.http.put(constant.serverURL + url, data).pipe(tap(result => {
      console.log(`PATCH API: ${url}, DATA: `, result);
    })).toPromise();
  }

  DELETE(url): Promise<any> {
    return this.http.delete(constant.serverURL + url).pipe(tap(result => {
      console.log(`DELETE API: ${url}, DATA: `, result);
    })).toPromise();
  }
}
