import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
describe('HomeComponent', () => {
  it('creates the standalone home page', async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    expect(
      TestBed.createComponent(HomeComponent).componentInstance,
    ).toBeTruthy();
  });
});
