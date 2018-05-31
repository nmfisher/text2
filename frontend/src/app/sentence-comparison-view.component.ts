import { OnInit, OnDestroy, OnChanges, Component, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { AppComponent } from './app.component';
import { SentencePair } from './sentence-pair';
import { SentencePairService } from './sentence-pair-service';
import { Annotation } from './annotation';
import { AnnotationService } from './annotation-service';
import { UserService } from './user-service';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';


@Component({
	selector: 'sentence-comparison-view',
	templateUrl: './sentence-comparison-view.component.html',
	styleUrls: ['./app.component.css'],
  providers: [ AnnotationService,
               SentencePairService,
                ]

})

export class SentenceComparisonViewComponent {
  sentencePair: SentencePair;
  annotation: Annotation;
	
  constructor(private annotationService: AnnotationService, private sentencePairService: SentencePairService, private userService: UserService) { 
	
	}

  ngOnInit(): void {
     this.next();
  }
	
	save(): void {
    this.annotationService.create(this.annotation)
      .catch((err:any) => { return Observable.throw(err); })
      .subscribe((response: Annotation) => {
        console.log(response);
        this.next();
      });
  }
		
	next() : void {
    var user = this.userService.current;
    console.log(user);
    this.sentencePairService.next().subscribe((sentencePair: SentencePair) => { 
      this.sentencePair = sentencePair;
      this.annotation = new Annotation(null, null, user, this.sentencePair);
    });
  }

  markDifferent() : void {
    console.log("different");
    this.annotation.annotation = -1;
    this.save();
  }

  markPartial() : void {
    this.annotation.annotation = 0;
    this.save();
  }

  markSame() : void {
    this.annotation.annotation = -1;
    this.save();
  }
}

