import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule }   from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { AppComponent } from './app.component';
import { FileService } from './file-service';
import { SentencePair } from './sentence-pair';
import { SentencePairService } from './sentence-pair-service';
import { Annotation } from './annotation';
import { AnnotationService } from './annotation-service';
import { File } from './file'
import { Label } from './label'
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
	HttpModule,
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
