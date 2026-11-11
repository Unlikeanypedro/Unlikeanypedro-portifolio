import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../data/translations.js";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("pt");
  const t = translations[lang];

  // Buscar projetos do GitHub automaticamente
  const [githubProjects, setGithubProjects] = useState([]);
  const [githubLoading, setGithubLoading] = useState(true);
  const [githubError, setGithubError] = useState(null);

  useEffect(() => {
    async function fetchGithubProjects() {
      try {
        const response = await fetch(
          "https://api.github.com/users/Unlikeanypedro/repos?per_page=10&sort=updated",
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch GitHub projects");
        }

        const data = await response.json();
        const projects = data.map((repo) => ({
          id: repo.id,
          name: {
            pt: repo.name || "Sem nome",
            en: repo.name || "No name",
          },
          description: {
            pt: repo.description || "",
            en: repo.description || "",
          },
          techs: repo.topics || [],
          repo: repo.html_url,
          image: null, // placeholder - could use repo avatar or default
          date: repo.updated_at?.substring(0, 7) || "",
        }));

        setGithubProjects(projects);
        setGithubLoading(false);
      } catch (error) {
        console.error("GitHub API error:", error);
        setGithubError(error.message);
        setGithubLoading(false);
      }
    }

    fetchGithubProjects();
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, githubProjects, githubLoading, githubError }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
export const useGithubProjects = () => useContext(LanguageContext).githubProjects;