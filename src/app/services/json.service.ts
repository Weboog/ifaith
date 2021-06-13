import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Guide } from '../types/guide';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  constructor(private http: HttpClient) { }

  getJson(url: string) {
    return this.http.get<Guide>(url);
  }
}
