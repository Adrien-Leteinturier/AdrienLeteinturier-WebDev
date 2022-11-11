import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { OfficeComponent } from './office/office.component';
import { PresModule } from './presentation/presentation.module';
import { SkillsModule } from './skills/skills.module';
import { JobModule } from './job/job.module';
import { ExpsModule } from './exps/exps.module';
import { ElementFormsModule } from './element-forms/element-forms.module';
import { ElementFormsService } from './element-forms/element-forms.service';
import { officeModule } from './office/office.module';
import { PresentationService } from './presentation/presentation.service';
import { WindowElementService } from './windowElement/window-element.service';
import { NewsApiService } from './newsApi/news-api.service';
import { InputValidsDirective } from './inputValids/input-valids.directive';
import { ExponentialStrengthPipe } from './exponentielle-strength.pipe';
import { environment} from '../environments/environment.prod';
import { AuthService } from './providers/auth.service';
import { HomeComponent } from './home/home.component';
import { homeModule } from './home/home.module';
import { NgsRevealModule } from 'ngx-scrollreveal';
import { JobContentComponent } from './job-content/job-content.component';
import { provideFirebaseApp, getApp, initializeApp } from "@angular/fire/app";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent, data: {animation: 'HomePage'}},
  { path: 'login', component: OfficeComponent },
  { path: 'job-content/:index', component: JobContentComponent, data: {animation: 'JobContentPage'}}
]

@NgModule({
  declarations: [
    AppComponent,
    InputValidsDirective,
    ExponentialStrengthPipe,
    JobContentComponent
  ],
  imports: [
    BrowserModule,
    homeModule,
    officeModule,
    PresModule,
    SkillsModule,
    JobModule,
    ExpsModule,
    ElementFormsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' }),
    NgsRevealModule
  ],
  providers:  [
    AuthService,
    ElementFormsService,
    PresentationService,
    WindowElementService,
    NewsApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
