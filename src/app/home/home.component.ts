import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ContactComponent } from '../contact/contact.component';
@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage, NavbarComponent, ContactComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly skills = [
    {
      name: 'Design',
      detail: 'Le souci du détail.',
      tools: [
        { name: 'Photoshop', image: 'photoshop.svg' },
        { name: 'Sass', image: 'sass.svg' },
        { name: 'HTML', image: 'html.svg' },
      ],
    },
    {
      name: 'Front-end',
      detail: 'Des interfaces qui prennent vie.',
      tools: [
        { name: 'JavaScript', image: 'js.svg' },
        { name: 'Angular', image: 'angular.svg' },
        { name: 'React', image: 'react.svg' },
      ],
    },
    {
      name: 'Back-end',
      detail: 'De solides fondations.',
      tools: [
        { name: 'Node.js', image: 'node-js.svg' },
        { name: 'NestJS', image: 'nestjs.svg' },
        { name: 'Java', image: 'java.svg' },
      ],
    },
  ];
  readonly careerExps = [
    {
      title: 'La Française des Jeux',
      img: 'la_francaise_des_jeux_logo.jpeg',
      current: true,
    },
    {
      title: 'Europ Assistance',
      img: 'europ_assistance_logo.jpeg',
      current: false,
    },
    { title: 'Société Générale', img: 'societe-generale.jpeg', current: false },
    { title: 'Renault', img: 'renault.jpeg', current: false },
    { title: 'Kpsule', img: 'kpsule.jpeg', current: false },
    { title: 'VLIS', img: 'vlis.png', current: false },
  ];
}
