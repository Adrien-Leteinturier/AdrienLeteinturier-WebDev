import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HomeComponent } from './home/home.component';
@Component({
  selector: 'app-root',
  imports: [HomeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
