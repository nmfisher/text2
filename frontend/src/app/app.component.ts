import { OnInit, OnDestroy, Component, ViewChild, EventEmitter, Input, Injectable } from '@angular/core';
import { HttpClient,HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { FileService } from './file-service';
import { SentencePair } from './sentence-pair';
import { SentencePairService } from './sentence-pair-service';
import { Annotation } from './annotation';
import { AnnotationService } from './annotation-service';
import { File } from './file';
import { LabelService } from './label-service';
import { Label } from './label';
import { UserService } from './user-service';
import 'rxjs/Rx';
import { TabsetComponent } from 'ngx-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-root',
	host: { '(document:click)': 'onClick($event)' },
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {

    fileService: FileService;
    labelService: LabelService;
    annotationService: AnnotationService;
    sentencePairService: SentencePairService;
    userService: UserService;
    mode: string;
    modes: string[];
	
  	constructor(private http:HttpClient) {  
      this.fileService = new FileService(http);
      this.labelService = new LabelService(http);
      this.annotationService = new AnnotationService(http);
      this.sentencePairService = new SentencePairService(http);
      this.modes = [ "sentence-pairs", "document-pairs" ];
    }
    
    ngOnInit(): void { 
        this.mode = "sentence-pairs";
    }

    setMode(mode:string): void  {
      this.mode = mode;
    }

    setUser(user:string): void {
      this.userService.current = user;
    }
}


