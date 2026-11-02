import { createFileRoute } from '@tanstack/react-router';
import { useRef, useState, type FormEvent } from 'react';
import { Display } from '~/components/Display';
import { LIMITS, validateContact, type ContactErrors } from '~/lib/contact';
import { portfolio } from '~/portfolio.config';
import { seo } from '~/utils/seo';

type Search = { sent?: boolean; invalid?: boolean; limited?: boolean };

export const Route = createFileRoute('/contact')({
  validateSearch: (search: Record<string, unknown>): Search => ({
    ...(search.sent ? { sent: true } : {}),
    ...(search.invalid ? { invalid: true } : {}),
    ...(search.limited ? { limited: true } : {})
  }),
  head: () =>
    seo({
      title: `Contact, ${portfolio.name}`,
      description: `Commissions, collaborations, and questions for ${portfolio.name} in ${portfolio.location}.`,
      path: '/contact'
    }),
  component: ContactPage
});

type Status = 'idle' | 'sending' | 'sent' | 'limited' | 'failed';

const FIELD_ORDER = ['name', 'email', 'message'] as const;
const FIRST_NAME = portfolio.name.split(' ')[0];

function ContactPage() {
  const search = Route.useSearch();
  const [status, setStatus] = useState<Status>(
    search.sent ? 'sent' : search.limited ? 'limited' : 'idle'
  );
  const [errors, setErrors] = useState<ContactErrors>(
    search.invalid ? { message: 'Check the form and send it again.' } : {}
  );
  const formRef = useRef<HTMLFormElement>(null);

  const focusFirstError = (found: ContactErrors) => {
    const first = FIELD_ORDER.find((field) => found[field]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const checked = validateContact({
      name: data.get('name'),
      email: data.get('email'),
      message: data.get('message')
    });
    if (!checked.ok) {
      setErrors(checked.errors);
      setStatus('idle');
      focusFirstError(checked.errors);
      return;
    }
    setErrors({});
    setStatus('sending');
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { accept: 'application/json' },
        body: new URLSearchParams(data as unknown as Record<string, string>)
      });
      if (response.status === 429) {
        setStatus('limited');
        return;
      }
      const result = (await response.json()) as { ok: boolean; errors?: ContactErrors };
      if (result.ok) {
        form.reset();
        setStatus('sent');
      } else {
        setErrors(result.errors ?? {});
        setStatus(result.errors ? 'idle' : 'failed');
        if (result.errors) focusFirstError(result.errors);
      }
    } catch {
      setStatus('failed');
    }
  };

  return (
    <main id='main' className='contact'>
      <div className='gutter page-head'>
        <Display as='h1' lines={['SAY', 'HOLA']} baseWidth={150} maxSize={30} />
      </div>
      <div className='gutter contact-grid'>
        <form
          ref={formRef}
          action='/api/contact'
          method='post'
          noValidate
          onSubmit={(event) => void onSubmit(event)}
          className='contact-form'
        >
          <Field label='Name' name='name' error={errors.name}>
            <input
              id='name'
              name='name'
              type='text'
              autoComplete='name'
              required
              maxLength={LIMITS.name}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
          </Field>
          <Field label='Email' name='email' error={errors.email}>
            <input
              id='email'
              name='email'
              type='email'
              autoComplete='email'
              required
              maxLength={LIMITS.email}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
          </Field>
          <Field label='Message' name='message' error={errors.message}>
            <textarea
              id='message'
              name='message'
              rows={7}
              required
              maxLength={LIMITS.message}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
          </Field>
          {/* For bots: people never see or reach this field. */}
          <div className='hp' aria-hidden='true'>
            <label htmlFor='website'>Leave this empty</label>
            <input id='website' name='website' type='text' tabIndex={-1} autoComplete='off' />
          </div>
          <div className='contact-send'>
            <button type='submit' className='send-button' disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending' : 'Send message'}
            </button>
            <output aria-live='polite' className='contact-status'>
              {status === 'sent'
                ? `Sent. ${FIRST_NAME} reads everything and replies within a week.`
                : status === 'limited'
                  ? 'That’s a lot of messages in a short time. Try again in ten minutes.'
                  : status === 'failed'
                    ? 'That didn’t send. Check your connection and try again.'
                    : ''}
            </output>
          </div>
        </form>
        <aside className='contact-side'>
          <p className='lede'>
            Commissions and collaborations from venues, labels, and festivals are
            the most welcome. Tell {FIRST_NAME} what it’s for and when it has to exist.
          </p>
          <h2 className='label about-label'>Elsewhere</h2>
          <ul className='social-list'>
            {portfolio.socials.map((social) => (
              <li key={social.url}>
                <a href={social.url} rel='me noreferrer'>
                  <span className='social-name'>{social.label}</span>
                  <span className='label'>{social.handle}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className='label contact-place'>{portfolio.location}</p>
        </aside>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  error,
  children
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className='field'>
      <label htmlFor={name} className='label'>
        {label}
      </label>
      {children}
      <p id={`${name}-error`} className='field-error' hidden={!error}>
        {error}
      </p>
    </div>
  );
}
