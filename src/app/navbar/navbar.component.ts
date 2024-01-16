import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isMenuOpened = false;

  toggleMenu() {
    this.isMenuOpened = !this.isMenuOpened;
  }
}
