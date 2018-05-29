import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule }   from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 
import { AppComponent } from './app.component';
import { FileService } from './file-service';
import { SentencePair } from './sentence-pair';
import { SentencePairService } from './sentence-pair-service';
import { Annotation } from './annotation';
import { AnnotationService } from './annotation-service';
import { UserService } from './user-service';
import { SentenceComparisonViewComponent } from './sentence-comparison-view.component';
import { File } from './file';
import { Label } from './label';
import { LabelService } from './label-service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [
    AppComponent,
    SentenceComparisonViewComponent,
   ],
  imports: [
    BrowserModule,
  	HttpClientModule,
  	RouterModule.forRoot([
      {
        path: 'files',
        component: AppComponent
      }
    ]),
	  TabsModule.forRoot(),
  	NgbModule.forRoot(),
  	BsDropdownModule.forRoot()
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
