import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
// import { Parser, HtmlRenderer } from 'commonmark';
// import { ActivatedRoute } from '@angular/router';
// import { Location } from '@angular/common';


import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { AppRoutingModule } from './app-routing.module';
import { PreviewComponent } from './preview/preview.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    EditComponent,
    PreviewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    // Parser,
    // HtmlRenderer,
    // Location,
    // ActivatedRoute
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
