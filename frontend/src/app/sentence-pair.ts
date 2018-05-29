import { OnInit, OnDestroy, Component, ViewChild, EventEmitter, Input, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class SentencePair {

  id: string;
  sentence0: string;
  sentence1: string;

  constructor(id:string, sentence0:string, sentence1: string) {
    this.id = id;
    this.sentence0 = sentence0;
    this.sentence1 = sentence1;
  }
}
