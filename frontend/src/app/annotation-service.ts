import { OnInit, OnDestroy, Component, ViewChild, EventEmitter, Input, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Annotation } from './annotation';
import { SentencePair } from './sentence-pair';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class AnnotationService {

  url:string;

  constructor(private http:HttpClient) {
    this.url = "/annotations";
  }

  create(annotation:Annotation): Observable<Annotation> {
    console.log("Creating annotation");
    console.log(annotation);
    return this.http.post<Annotation>(this.url, annotation);
  }


}
