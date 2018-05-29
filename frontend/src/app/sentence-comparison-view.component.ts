import { OnInit, OnDestroy, OnChanges, Component, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { AppComponent } from './app.component';
import { SentencePair } from './sentence-pair';
import { SentencePairService } from './sentence-pair-service';
import { Annotation } from './annotation';
import { AnnotationService } from './annotation-service';
import { UserService } from './user-service';

@Component({
	selector: 'sentence-comparison-view',
	templateUrl: './sentence-comparison-view.component.html',
	styleUrls: ['./app.component.css'],
  providers: [ AnnotationService,
               SentencePairService,
               UserService ]

})

export class SentenceComparisonViewComponent {
	
  
  sentencePair: SentencePair;
  annotation: Annotation;
    
	constructor(private annotationService: AnnotationService, private sentencePairService: SentencePairService, private userService: UserService) { 
	
	}

  ngOnInit(): void {
     this.next();
  }
	
	save(name: string): void {
    this.annotationService.create(this.annotation);		
    this.next();
  }
		
	next() : void {
    //this.sentencePair = this.sentencePairService.next();
    this.sentencePair = new SentencePair(null, "Sentence 1", "Sentence 2");
    this.annotation = new Annotation(null, null, this.userService.current, this.sentencePair);
	}

  onSame() : void {
    this.annotation.annotation = 1;
  }

  onPartial() : void {
    this.annotation.annotation = 0;
  }

  onDifferent() : void {
    this.annotation.annotation = -1;
  }
    
}


	

	
