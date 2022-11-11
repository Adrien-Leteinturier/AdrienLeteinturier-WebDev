import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewsApiComponent } from './news-api.component';

describe('NewsApiComponent', () => {
  let component: NewsApiComponent;
  let fixture: ComponentFixture<NewsApiComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
