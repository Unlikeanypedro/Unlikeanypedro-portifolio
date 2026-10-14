import { useLanguage } from '../context/LanguageContext.jsx'
import { experiences } from '../data/experiences.js'
import PageHeading from '../components/PageHeading.jsx'

const pad = (n) => String(n).padStart(2, '0')

export default function Experiences() {
  const { t, lang } = useLanguage()
  return (
    <>
      <PageHeading title={t.experiences.title} subtitle={t.experiences.subtitle} />
      <section className="sheet exp-sheet">
        {experiences.map((e, i) => (
          <article key={e.id} className="exp-row">
            <span className="exp-row__num">{pad(i + 1)}.</span>
            <div>
              <h2>{e.organization}</h2>
              <p className="exp-row__role">{e.role[lang]}</p>
              <p className="text">{e.description[lang]}</p>
            </div>
            <p className="exp-row__period">{e.period}</p>
          </article>
        ))}
      </section>
    </>
  )
}
