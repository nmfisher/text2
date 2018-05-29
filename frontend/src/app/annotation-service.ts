import { OnInit, OnDestroy, Component, ViewChild, EventEmitter, Input, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Annotation } from './annotation';
import { SentencePair } from './sentence-pair';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class AnnotationService {

  url: '/annotations';

  constructor(private http:HttpClient) {
  }

  create(annotation:number, sentencePair:SentencePair): Observable<Annotation> {
    return this.http.post<Annotation>(this.url, annotation);
  }


}
