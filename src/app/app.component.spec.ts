import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
describe('Portfolio', () => {
  it('renders the introduction and all original sections without scrolling', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const page: HTMLElement = fixture.nativeElement;
    expect(page.querySelector('h1')?.textContent).toContain('Vos idées.');
    for (const id of ['myself', 'skills', 'career']) {
      expect(page.querySelector('#' + id)).not.toBeNull();
    }
    expect(page.textContent).toContain(
      'tech lead / lead dev chez La Française des Jeux (FDJ)',
    );
    expect(page.querySelectorAll('.career-card')).toHaveLength(6);
    expect(page.querySelectorAll('.skill-card')).toHaveLength(3);
  });
});
