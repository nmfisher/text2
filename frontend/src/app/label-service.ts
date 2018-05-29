import { OnInit, OnDestroy, Component, ViewChild, EventEmitter, Input, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Label } from './label';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class LabelService {

  url: "/labels";
	
 	constructor(private http:HttpClient) {
		this.http = http;
	}	
	
  list(): Observable<Label[]> {
    return this.http.get<Label[]>(this.url);    
  }

  create(label:Label): Observable<Label> {
    return this.http.post<Label>(this.url + "/{label.id}", label);
  }

  delete(label:Label): Observable<{}> {
    return this.http.delete(this.url + "{label.id}");
  }

}
	
 
