import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpHelperService {

  constructor(private httpClient: HttpClient) { }

  baseURL = "http://127.0.0.1:5000/";

  put(url: string, data: FormData): Observable<any> {
    return this.httpClient.put(this.baseURL + url, data, { responseType: 'json' });
  }
  post(url: string, data: FormData): Observable<any> {
    return this.httpClient.post(this.baseURL + url, data, { responseType: 'json' });
  }
  get(url: string): Observable<any> {
    return this.httpClient.get(this.baseURL + url, { responseType: 'json' });
  }
  SendDeleteRequest(url: string): Observable<any> {
    return this.httpClient.delete(this.baseURL + url, { responseType: 'json' });
  }
}
