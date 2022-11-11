import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ElementFormsComponent } from './element-forms.component';
import { ElementFormsService } from './element-forms.service';
import { ConnectionBackend } from '@angular/http';
import { WeatherService } from '../weatherApi/weather.service'
import {HttpClient, HttpClientModule} from '@angular/common/http';


describe('ElementFormsComponent', () => {
  let component: ElementFormsComponent;
  let fixture: ComponentFixture<ElementFormsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports : [FormsModule, HttpClientModule],
      declarations: [ ElementFormsComponent ],
      providers: [
        ElementFormsService,
        HttpClient,
        ConnectionBackend,
        WeatherService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
