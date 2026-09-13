import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { regexes } from 'zod/v4/core';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  readonly sending = signal(false);
  readonly error = signal('');
  readonly sent = signal(false);
  readonly form = this.fb.nonNullable.group({
    projectType: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern(regexes.html5Email)]],
    company: [''],
    phone: [''],
    description: ['', Validators.required],
    timeline: ['', Validators.required],
    budget: [''],
    website: [''],
    privacy: [false, Validators.requiredTrue],
  });

  invalid(field: keyof typeof this.form.controls) {
    const control = this.form.controls[field];
    return control.invalid && control.touched;
  }

  async submit() {
    if (this.sending()) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.sending.set(true);
    this.error.set('');
    try {
      const result = await firstValueFrom(
        this.http.post<{ sent: boolean }>(
          '/api/contact',
          this.form.getRawValue(),
        ),
      );
      if (result?.sent !== true) throw new Error('Unconfirmed email');
      this.sent.set(true);
      this.form.reset();
    } catch (failure: unknown) {
      const status = (failure as { status?: number }).status;
      this.error.set(
        status === 429
          ? 'Vous avez envoyé plusieurs demandes récemment. Réessayez plus tard ou contactez-moi sur LinkedIn.'
          : status === 400
            ? 'Vérifiez les champs et réessayez dans quelques secondes.'
            : 'L’envoi n’a pas pu être confirmé. Réessayez ou contactez-moi sur LinkedIn.',
      );
    } finally {
      this.sending.set(false);
    }
  }
}
