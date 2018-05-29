import { OnInit, OnDestroy, Component, ViewChild, EventEmitter, Input, Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { File } from './file';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';


export class Label {

	id: string;
	name: string;
	
	constructor(id:string, name:string) { 
        this.id = id;
        this.name = name;
	}
}


