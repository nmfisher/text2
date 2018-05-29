import { OnInit, OnDestroy, Component, ViewChild, EventEmitter, Input, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { SentencePair } from './sentence-pair';
import 'rxjs/Rx';

@Injectable()
export class SentencePairService {

  nextUrl: '/sentence_pairs/next';
  url: '/sentence_pairs';

  constructor(private http:HttpClient) {
  }

  next(): Observable<SentencePair> {
    return this.http.get<SentencePair>(this.nextUrl);
  }

}

