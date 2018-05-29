import { OnInit, OnDestroy, Component, ViewChild, EventEmitter, Input, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Label } from './label';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class File {
	
	id: string;
	filepath: string;
	filename: string;
  complete: boolean;
  corrupt: boolean;
  labels: Label[]
  
	constructor(labels:Label[], id:string, filepath:string, filename:string, complete:boolean, corrupt:boolean) {
		this.labels = labels;
		this.id = id;
    this.complete = complete;
    this.corrupt = corrupt;
		this.filepath = filepath;
		this.filename = filename;	
	}	
}
