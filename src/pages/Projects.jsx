import { useLanguage } from '../context/LanguageContext.jsx'
import { projects } from '../data/projects.js'
import PageHeading from '../components/PageHeading.jsx'
import Placeholder from '../components/Placeholder.jsx'

export default function Projects() {
  const { t, lang } = useLanguage()
  const sorted = [...projects].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <section>
      <PageHeading title={t.projects.title} subtitle={t.projects.subtitle} />
      <ol className="timeline">
        {sorted.map((p) => (
          <li key={p.id} className="timeline__item">
            <time className="timeline__date">{p.date}</time>
            <article className="project">
              <h2>{p.name[lang]}</h2>
              <p>{p.description[lang]}</p>
              <p className="project__techs">
                <strong>{t.projects.techs}:</strong> {p.techs.join(', ')}
              </p>
              <a href={p.repo} target="_blank" rel="noreferrer" className="btn btn--ghost">
                {t.projects.repo}
              </a>
              {p.image ? (
                <img className="project__media" src={p.image} alt={p.name[lang]} />
              ) : (
                <Placeholder label={t.projects.imageLabel} />
              )}
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}
