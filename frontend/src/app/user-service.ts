import { OnInit, OnDestroy, Component, ViewChild, EventEmitter, Input, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import 'rxjs/Rx';

@Injectable({providedIn: 'root'})
export class UserService {

  current: string;

  constructor(private http:HttpClient) {
  }

}

