import { useState } from 'react'
import { useForm } from 'react-hook-form'
import emailjs from '@emailjs/browser'
import { useLanguage } from '../context/LanguageContext.jsx'
import { contactLinks } from '../data/profile.js'
import PageHeading from '../components/PageHeading.jsx'
import Icon from '../components/Icon.jsx'

export default function Contact() {
  const { t } = useLanguage()
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setStatus('sending')
    try {
      // name, email e message precisam bater com as variáveis do template no EmailJS.
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { name: data.name, email: data.email, message: data.message },
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY },
      )
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <PageHeading title={t.contact.title} subtitle={t.contact.subtitle} />

      <section className="sheet contact-sheet">
        <div className="contact-sheet__links">
          <p className="label">{t.contact.channels}</p>
          {contactLinks.map((l) => (
            <a key={l.id} href={l.href} target="_blank" rel="noreferrer" className="contact-link">
              <Icon name={l.id} />
              <span>{l.label}</span>
            </a>
          ))}
        </div>

        <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label>
            {t.contact.name}
            <input {...register('name', { required: t.contact.required })} />
            {errors.name && <span className="form__error">{errors.name.message}</span>}
          </label>

          <label>
            {t.contact.email}
            <input
              type="email"
              {...register('email', {
                required: t.contact.required,
                pattern: { value: /^\S+@\S+\.\S+$/, message: t.contact.invalidEmail },
              })}
            />
            {errors.email && <span className="form__error">{errors.email.message}</span>}
          </label>

          <label>
            {t.contact.message}
            <textarea
              rows="5"
              {...register('message', {
                required: t.contact.required,
                minLength: { value: 10, message: t.contact.minMessage },
              })}
            />
            {errors.message && <span className="form__error">{errors.message.message}</span>}
          </label>

          <button type="submit" className="btn" disabled={status === 'sending'}>
            {status === 'sending' ? t.contact.sending : t.contact.send}
          </button>

          {status === 'success' && <p className="form__status form__status--ok">{t.contact.success}</p>}
          {status === 'error' && <p className="form__status form__status--err">{t.contact.error}</p>}
        </form>
      </section>
    </>
  )
}
