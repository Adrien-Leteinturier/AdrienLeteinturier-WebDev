import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home.component";
import { PresModule } from "../presentation/presentation.module";
import { SkillsModule } from "../skills/skills.module";
import { JobModule } from "../job/job.module";
import { ExpsModule } from "../exps/exps.module";
import { FooterComponent } from "../footer/footer.component";
import { ScrollBackButtonComponent } from "../scroll-back-button/scroll-back-button.component";
import { ToastaModule } from "ngx-toasta";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ApplicationComponent } from "../application/application.component";

@NgModule({
  imports: [
    CommonModule,
    PresModule,
    SkillsModule,
    JobModule,
    ExpsModule,
    ToastaModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    HomeComponent,
    FooterComponent,
    ScrollBackButtonComponent,
    ApplicationComponent,
  ],
  exports: [HomeComponent],
  providers: [],
})
export class homeModule {}
