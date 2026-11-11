import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import Experiences from "./pages/Experiences.jsx";
import Contact from "./pages/Contact.jsx";
import InitialMenu from "./pages/InitialMenu.jsx";
import Map from "./pages/Game.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";

export default function App() {
    return (
        <LanguageProvider>
            <Routes>
                <Route path="/" element={<InitialMenu />} />
                <Route element={<Layout />}>
                    <Route path="sobre" element={<About />} />
                    <Route path="projetos" element={<Projects />} />
                    <Route path="experiencias" element={<Experiences />} />
                    <Route path="contato" element={<Contact />} />
                    <Route path="mapa" element={<Map />} />
                    <Route path="*" element={<About />} />
                </Route>
            </Routes>
        </LanguageProvider>
    );
}