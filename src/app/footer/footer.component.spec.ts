import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ElementFormsService } from '../element-forms/element-forms.service';
import { FooterComponent } from './footer.component';
import { FormBuilder } from '@angular/forms';
import { HttpClient, ConnectionBackend, HttpClientModule } from '@angular/http';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { PresentationService } from '../presentation/presentation.service';


describe('HomeComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      declarations: [ FooterComponent ],
      providers: [
        ElementFormsService,
        HttpClient,
        ConnectionBackend,
        FormBuilder,
        ToastsManager,
        ToastOptions,
        PresentationService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ElementFormsService return value form', () => {
    console.log(ElementFormsService);
  })
});
