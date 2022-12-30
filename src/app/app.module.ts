import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { OfficeComponent } from './office/office.component';
import { PresModule } from './presentation/presentation.module';
import { JobModule } from './job/job.module';
import { ExpsModule } from './exps/exps.module';
import { officeModule } from './office/office.module';
import { PresentationService } from './presentation/presentation.service';
import { WindowElementService } from './windowElement/window-element.service';
import { environment} from '../environments/environment.prod';
import { AuthService } from './providers/auth.service';
import { HomeComponent } from './home/home.component';
import { homeModule } from './home/home.module';
import { JobContentComponent } from './job-content/job-content.component';
import { AngularFireModule } from '@angular/fire/compat';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent, data: {animation: 'HomePage'}},
  { path: 'login', component: OfficeComponent },
  { path: 'job-content/:index', component: JobContentComponent, data: {animation: 'JobContentPage'}}
]

@NgModule({
  declarations: [
    AppComponent,
    JobContentComponent,
  ],
  imports: [
    BrowserModule,
    homeModule,
    officeModule,
    PresModule,
    JobModule,
    ExpsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    RouterModule.forRoot(appRoutes, { relativeLinkResolution: "legacy" }),
  ],
  providers: [
    AuthService,
    PresentationService,
    WindowElementService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
