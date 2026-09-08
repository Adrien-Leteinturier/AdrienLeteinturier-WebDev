import { TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
describe('Mobile navigation', () => {
  it('exposes its state and closes after navigation or Escape', async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    const page: HTMLElement = fixture.nativeElement;
    const toggle = page.querySelector('button')!;
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    (page.querySelector('#main-navigation a') as HTMLAnchorElement).click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    fixture.detectChanges();
    toggle.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });
});
