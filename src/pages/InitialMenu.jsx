import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import menuVideo from "../assets/videos/bg/menuVideoBG.mp4";

export default function InitialMenu() {
    const videoRef = useRef(null);

    const menuItems = [
        { label: "sobre", path: "/sobre" },
        { label: "projetos", path: "/projetos" },
        { label: "experiencia", path: "/experiencias" },
        { label: "contato", path: "/contato" },
    ];

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.muted = true;
            video.play().catch(() => {
                // Autoplay may be blocked by browser, user interaction needed
            });
        }
    }, []);

    return (
        <div className="initial-menu">
            <video
                ref={videoRef}
                className="menu-bg-video"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src={menuVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <main className="menu-content">
                <section className="menu-title-card" aria-label="Portfolio">
                    <p>Unlikeanypedro</p>
                    <h1>Portifolio</h1>
                </section>

                <nav className="menu-nav-card" aria-label="Navegação principal">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className="menu-item"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </main>
            <span className="menu-version">Portifólio · 2026</span>
        </div>
    );
}
