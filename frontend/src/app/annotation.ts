import { OnInit, OnDestroy, Component, ViewChild, EventEmitter, Input, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { SentencePair } from './sentence-pair';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class Annotation {

  id: string;
  user: string;
  annotation: number;
  sentencePair: SentencePair;

  constructor(id:string, user:string, annotation:number, sentencePair:SentencePair) {
    this.id = id;
    this.annotation = annotation;
    this.user = user;
    this.sentencePair = sentencePair;
  }

}


