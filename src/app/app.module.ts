import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { OfficeComponent } from './office/office.component';
import { NavModule } from './nav/nav.module';
import { PresModule } from './presentation/presentation.module';
import { SkillsModule } from './skills/skills.module';
import { JobModule } from './job/job.module';
import { ExpsModule } from './exps/exps.module';
import { ElementFormsModule } from './element-forms/element-forms.module';
import { ElementFormsService } from './element-forms/element-forms.service';
import { officeModule } from './office/office.module';
import { PresentationService } from './presentation/presentation.service';
import { WindowElementService } from './windowElement/window-element.service';
import { BlotterService } from './blotterService/blotter.service';
import { QuotesService } from './quotesService/quotes.service'
import { NewsApiService } from './newsApi/news-api.service';
import { InputValidsDirective } from './inputValids/input-valids.directive';
import { ExponentialStrengthPipe } from './exponentielle-strength.pipe';
import { environment} from '../environments/environment.prod';
import { AuthService } from './providers/auth.service';
import { HomeComponent } from './home/home.component';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database-deprecated';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { homeModule } from './home/home.module';
import {QuicklinkStrategy, QuicklinkModule} from 'ngx-quicklink';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login',      component: OfficeComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    InputValidsDirective,
    ExponentialStrengthPipe
  ],
  imports: [
    BrowserModule,
    homeModule,
    officeModule,
    NavModule,
    PresModule,
    SkillsModule,
    JobModule,
    ExpsModule,
    ElementFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireModule,
    AngularFireAuthModule,
    RouterModule.forRoot(appRoutes, {
      preloadingStrategy: QuicklinkStrategy
    }),
    ReactiveFormsModule
  ],
  providers:  [
    AuthService,
    ElementFormsService,
    PresentationService,
    WindowElementService,
    BlotterService,
    QuotesService,
    NewsApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
