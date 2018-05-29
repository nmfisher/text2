import { OnInit, OnDestroy, Component, ViewChild, EventEmitter, Input, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { File } from './file';
import { Label } from './label';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class FileService {

  url: "/url";
	
	constructor(private http:HttpClient) {
	}	
	
  update(file:File): Observable<File> {
    return this.http.put<File>(this.url + "/{file.id}", file);
  }

  removeLabel(label: Label, file:File): Observable<File> {                              
    var labelIdx = file.labels.indexOf(label);
    
    if(labelIdx > -1) {
      file.labels.splice(labelIdx, 1);  
    }
     return this.update(file);
  }
    
	addLabel(label: Label, file:File): Observable<File> {
     file.labels.push(label);
     return this.update(file);
  }
}


