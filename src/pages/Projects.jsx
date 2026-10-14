import { useLanguage } from '../context/LanguageContext.jsx'
import { projects } from '../data/projects.js'
import PageHeading from '../components/PageHeading.jsx'
import Placeholder from '../components/Placeholder.jsx'

const pad = (n) => String(n).padStart(2, '0')

export default function Projects() {
  const { t, lang } = useLanguage()
  const sorted = [...projects].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <>
      <PageHeading title={t.projects.title} subtitle={t.projects.subtitle} />

      <section className="sheet index-sheet">
        <h2>{t.projects.index}</h2>
        <ol className="index-list">
          {sorted.map((p, i) => (
            <li key={p.id}>
              <a href={`#projeto-${p.id}`}>
                <span className="label">{pad(i + 1)}.</span>
                <span className="label">{p.name[lang]}</span>
                <time>{p.date}</time>
              </a>
            </li>
          ))}
        </ol>
      </section>

      {sorted.map((p) => (
        <article key={p.id} id={`projeto-${p.id}`} className="sheet project-sheet">
          <div className="project-sheet__title">
            <h2>{p.name[lang]}</h2>
          </div>
          <div className="project-sheet__media">
            {p.image ? (
              <div className="image-block">
                <img src={p.image} alt={p.name[lang]} />
              </div>
            ) : (
              <Placeholder label={t.projects.imageLabel} />
            )}
          </div>
          <div className="project-sheet__side">
            <time className="project-sheet__date">{p.date}</time>
            <span className="quote-mark" aria-hidden="true">”</span>
            <p className="text">{p.description[lang]}</p>
            <p className="project-sheet__techs">
              <strong>{t.projects.techs}:</strong> {p.techs.join(' · ')}
            </p>
            <a href={p.repo} target="_blank" rel="noreferrer" className="btn btn--ghost">
              {t.projects.repo}
            </a>
          </div>
        </article>
      ))}
    </>
  )
}
