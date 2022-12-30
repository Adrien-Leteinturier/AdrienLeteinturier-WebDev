import { Component, ApplicationRef, ElementRef, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ToastaConfig, ToastaService } from "ngx-toasta";
import account_validation_messages from "../config/error_inputs";
import labels from "../config/labels";

@Component({
  moduleId: module.id,
  selector: "app-skills",
  templateUrl: "./skills.component.html",
  styleUrls: ["./skills.component.css"],
})
export class SkillsComponent {}
