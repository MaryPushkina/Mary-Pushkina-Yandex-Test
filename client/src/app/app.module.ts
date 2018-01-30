import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';

import { AppComponent } from './app.component';
import { TimeboardComponent } from './timeboard/timeboard.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { DataService } from './services/data.service';

const appRoutes: Routes = [
  {
    path: '',
    component: TimeboardComponent
  },
  {
    path: 'create-event',
    component: CreateEventComponent
  },
  {
    path: 'edit-event',
    component: EditEventComponent
  },
];

@NgModule({
  declarations: [
    AppComponent,
    TimeboardComponent,
    CreateEventComponent,
    EditEventComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ApolloModule,
    HttpLinkModule
  ],
  providers: [DataService, { provide: LOCALE_ID, useValue: 'ru' }],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(apollo: Apollo, httpLink: HttpLink) {
    registerLocaleData(localeRu);
    apollo.create({
      link: httpLink.create({ uri: 'localhost:3000/graphql' }),
      cache: new InMemoryCache()
    });
  }
}
