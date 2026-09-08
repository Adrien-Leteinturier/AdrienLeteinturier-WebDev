import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
describe('Freelance storefront', () => {
  it('shows services, genuine work, experience and an honest unavailable contact state', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController)
      .expectOne('/api/contact')
      .flush({ available: false });
    await fixture.whenStable();
    fixture.detectChanges();
    const page: HTMLElement = fixture.nativeElement;
    expect(page.querySelector('h1')?.textContent).toContain('votre');
    for (const id of [
      'myself',
      'services',
      'work',
      'about',
      'skills',
      'career',
      'contact',
    ])
      expect(page.querySelector('#' + id)).not.toBeNull();
    expect(page.textContent).toContain(
      'tech lead / lead dev chez La Française des Jeux (FDJ)',
    );
    expect(page.querySelectorAll('.career-card')).toHaveLength(6);
    expect(page.querySelectorAll('.service-card')).toHaveLength(2);
    expect(page.textContent).toContain('personnelle et indépendante');
  });
});
