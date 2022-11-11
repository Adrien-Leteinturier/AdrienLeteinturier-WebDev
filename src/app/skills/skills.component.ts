import { Component, ApplicationRef, ElementRef, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastaConfig, ToastaService } from 'ngx-toasta';
import { ElementFormsService } from '../element-forms/element-forms.service';
import { PresentationService } from '../presentation/presentation.service';
import account_validation_messages from '../config/error_inputs';
import labels from '../config/labels';

@Component({
    moduleId: module.id,
    selector: 'app-skills',
    templateUrl: './skills.component.html',
    styleUrls: ['./skills.component.css']
})

export class SkillsComponent implements OnInit{
    
    accountDetailsForm: UntypedFormGroup;
    validationConfig = account_validation_messages;
    labelInputs = labels.input[0];
    
    constructor(    
        public elementFormService: ElementFormsService,
        public fb: UntypedFormBuilder, 
        public el : ElementRef,
        public toastaService:ToastaService,
        public toastaConfig: ToastaConfig){
            this.toastaConfig.theme = 'material';
        }
        
        
        ngOnInit(): void {
            this.createForms();
        }
        
        postMailMessage = (formValue) =>{
            if(this.accountDetailsForm.valid === true){
                this.elementFormService.postContactForm(formValue);
                this.accountDetailsForm.reset('');
                this.toastFc('succes','Votre message est envoyé');
            } else if(this.accountDetailsForm.valid === false || this.accountDetailsForm.value.username == "" || this.accountDetailsForm.value.email == "") {
                this.toastFc('error','Erreur !!! Votre message n\'a pas été envoyé, Vérifier votre saisie...');
            }
        }

        createForms = () =>{
            // user links form validations
            this.accountDetailsForm = this.fb.group({
              username: new UntypedFormControl('', Validators.compose([
               Validators.minLength(5),
               Validators.required
              ])),
              email: new UntypedFormControl('', Validators.compose([
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
              ])),
              message: new UntypedFormControl('', Validators.compose([
                Validators.minLength(5)
               ]))      
            })
          }
        
        toastFc = (type,text) =>{
            switch (type) {
                case 'succes':
                this.toastaService.success(text);
                break;
                case 'error':
                this.toastaService.error(text);
                break;  
                case 'warning':
                this.toastaService.warning(text);
                break;
                case 'info':
                this.toastaService.info(text);
                break;
            }
        }; 
        
        
    }