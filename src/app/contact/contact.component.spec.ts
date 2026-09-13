import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact.component';
describe('Contact form', () => {
  async function setup() {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    const fixture = TestBed.createComponent(ContactComponent);
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectNone('/api/contact');
    await fixture.whenStable();
    fixture.detectChanges();
    return { fixture, http, component: fixture.componentInstance };
  }
  const valid = {
    projectType: 'wordpress',
    name: 'Prospect Test',
    email: 'test@example.com',
    company: '',
    phone: '',
    description:
      'Je souhaite présenter mon activité de conseil sur un nouveau site.',
    timeline: 'flexible',
    budget: '',
    website: '',
    companyFax: '',
    privacy: true,
  };
  it('allows submission without a preparation request', async () => {
    const { fixture, http } = await setup();
    expect(fixture.nativeElement.querySelector('[type=submit]').disabled).toBe(
      false,
    );
    http.verify();
  });
  it('validates before submitting', async () => {
    const { component, http } = await setup();
    await component.submit();
    expect(component.form.controls.email.touched).toBe(true);
    http.expectNone((r) => r.method === 'POST');
    http.verify();
  });
  it('preserves the message and prevents duplicate submissions after an error', async () => {
    const { component, http } = await setup();
    component.form.setValue(valid);
    const pending = component.submit();
    await component.submit();
    const req = http.expectOne((r) => r.method === 'POST');
    expect(req.request.body).toEqual(valid);
    req.flush(
      { error: 'CONTACT_UNAVAILABLE' },
      { status: 503, statusText: 'Unavailable' },
    );
    await pending;
    expect(component.form.controls.description.value).toBe(valid.description);
    expect(component.reference()).toBe('');
    expect(component.error()).toContain('pas pu être confirmé');
    http.verify();
  });
  it('preserves fields after a validation error without preparing again', async () => {
    const { component, http } = await setup();
    component.form.setValue(valid);
    const pending = component.submit();
    http
      .expectOne((r) => r.method === 'POST')
      .flush(
        { error: 'INVALID_CONTACT' },
        { status: 400, statusText: 'Bad Request' },
      );
    await pending;
    expect(component.form.getRawValue()).toEqual(valid);
    expect(component.sending()).toBe(false);
    expect(component.error()).not.toBe('');
    http.expectNone('/api/contact');
    http.verify();
  });
  it('shows success only for confirmed storage, without claiming Gmail delivery', async () => {
    const { component, http, fixture } = await setup();
    component.form.setValue(valid);
    const pending = component.submit();
    http
      .expectOne((r) => r.method === 'POST')
      .flush({ stored: true, id: 'TEST-REFERENCE' });
    await pending;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'Votre demande est enregistrée.',
    );
    expect(fixture.nativeElement.textContent).toContain('TEST-REFERENCE');
    expect(fixture.nativeElement.textContent).not.toContain('e-mail reçu');
    http.verify();
  });
});
