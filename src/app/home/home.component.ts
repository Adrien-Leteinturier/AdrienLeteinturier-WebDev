import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import {
  AnimationEvent,
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('neonEffect', [
      state(
        'off',
        style({
          opacity: 0,
        })
      ),
      state(
        'on',
        style({
          opacity: 1,
        })
      ),
      transition('* => on', [
        animate(
          '1.5s',
          keyframes([
            style({ opacity: 0 }),
            style({ opacity: 0.3 }),
            style({ opacity: 0 }),
            style({ opacity: 0.6 }),
            style({ opacity: 0 }),
            style({ opacity: 1 }),
          ])
        ),
      ]),
    ]),
  ],
  imports: [NgOptimizedImage, NavbarComponent, CommonModule],
})
export class HomeComponent implements OnInit {
  @ViewChild('skills') skills!: ElementRef;

  isOn!: boolean;
  neonEffectIsDone!: boolean;
  careerExps = [
    {
      title: 'LA FRANÇAISE DES JEUX',
      img: 'assets/img/la_francaise_des_jeux_logo.jpeg',
      content: '',
    },
    {
      title: 'EUROPE ASSISTANCE',
      img: 'assets/img/europ_assistance_logo.jpeg',
      content: '',
    },
    {
      title: 'SOCIETE GENERALE',
      img: 'assets/img/societe-generale.jpeg',
      content: '',
    },
    {
      title: 'RENAULT',
      img: 'assets/img/renault.jpeg',
      content: '',
    },
    {
      title: 'KPSULE',
      img: 'assets/img/kpsule.jpeg',
      content: '',
    },
    {
      title: 'VLIS',
      img: 'assets/img/vlis.png',
      content: '',
    },
  ];

  @HostListener('window:scroll')
  onScroll() {
    const skillElement = this.skills.nativeElement as HTMLElement;
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    if (
      scrollPosition >= skillElement.getBoundingClientRect().top ||
      skillElement.getBoundingClientRect().top < window.innerHeight / 2
    ) {
      this.isOn = true;
    }
  }

  ngOnInit() {}

  onAnimationEvent(event: AnimationEvent) {
    this.neonEffectIsDone = event.toState === 'on';
  }
}
