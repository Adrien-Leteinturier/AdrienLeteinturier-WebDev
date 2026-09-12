import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  readonly isMenuOpened = signal(false);
  toggleMenu() {
    this.isMenuOpened.update((open) => !open);
  }
  closeMenu() {
    this.isMenuOpened.set(false);
  }
}
