import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(private http: HttpClient) { }

  getItems(): Observable<any> {
    return this.http.get('https://api.mocki.io/v1/47ed1580')
  }
}
