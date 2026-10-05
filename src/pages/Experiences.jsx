import { useLanguage } from '../context/LanguageContext.jsx'
import { experiences } from '../data/experiences.js'
import PageHeading from '../components/PageHeading.jsx'

export default function Experiences() {
  const { t, lang } = useLanguage()
  return (
    <section>
      <PageHeading title={t.experiences.title} subtitle={t.experiences.subtitle} />
      <div className="experience-list">
        {experiences.map((e) => (
          <article key={e.id} className="experience">
            <h2>{e.organization}</h2>
            <p className="experience__meta">
              {e.role[lang]} — {e.period}
            </p>
            <p>{e.description[lang]}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
