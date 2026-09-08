import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private token = '';
  readonly loading = signal(true);
  readonly available = signal(false);
  readonly sending = signal(false);
  readonly error = signal('');
  readonly reference = signal('');
  readonly form = this.fb.nonNullable.group({
    projectType: ['', Validators.required],
    name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    ],
    email: [
      '',
      [Validators.required, Validators.email, Validators.maxLength(254)],
    ],
    company: ['', Validators.maxLength(120)],
    phone: [
      '',
      [Validators.maxLength(30), Validators.pattern(/^[+()\d .-]*$/)],
    ],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(30),
        Validators.maxLength(5000),
      ],
    ],
    timeline: ['', Validators.required],
    budget: [''],
    website: ['', Validators.maxLength(300)],
    companyFax: [''],
    privacy: [false, Validators.requiredTrue],
  });

  ngOnInit() {
    void this.prepare();
  }

  async prepare() {
    this.loading.set(true);
    this.available.set(false);
    try {
      const result = await firstValueFrom(
        this.http.get<{ available: boolean; token?: string }>('/api/contact'),
      );
      if (result.available && result.token) {
        this.token = result.token;
        this.available.set(true);
      }
    } catch {
      this.available.set(false);
    } finally {
      this.loading.set(false);
    }
  }

  invalid(field: keyof typeof this.form.controls) {
    const control = this.form.controls[field];
    return control.invalid && control.touched;
  }

  async submit() {
    if (this.sending() || !this.available()) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.sending.set(true);
    this.error.set('');
    try {
      const result = await firstValueFrom(
        this.http.post<{ id: string; stored: boolean }>('/api/contact', {
          ...this.form.getRawValue(),
          token: this.token,
        }),
      );
      if (!result.stored || !result.id) throw new Error('Unconfirmed storage');
      this.reference.set(result.id);
      this.form.reset();
    } catch (failure: unknown) {
      const status = (failure as { status?: number }).status;
      this.error.set(
        status === 429
          ? 'Vous avez envoyé plusieurs demandes récemment. Réessayez plus tard ou contactez-moi sur LinkedIn.'
          : status === 400
            ? 'Vérifiez les champs et réessayez dans quelques secondes. Votre message est conservé dans le formulaire.'
            : 'L’envoi n’a pas pu être confirmé. Votre message est conservé ici : réessayez ou contactez-moi sur LinkedIn.',
      );
      if (status === 400) await this.prepare();
    } finally {
      this.sending.set(false);
    }
  }
}
