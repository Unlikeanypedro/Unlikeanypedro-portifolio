import { useState } from "react";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { useLanguage } from "../context/LanguageContext.jsx";
import Ornament from "../components/Ornament.jsx";
import { contactLinks } from "../data/profile.js";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Ícones dos canais (SVG inline, herdam a cor do texto).
function ChannelIcon({ id }) {
    if (id === "email") {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
                focusable="false"
            >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3.5 7.5 8.5 6 8.5-6" />
            </svg>
        );
    }

    if (id === "whatsapp") {
        return (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                <path d="M12 2a9.9 9.9 0 0 0-8.5 15L2 22l5.2-1.4A9.9 9.9 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Z" />
                <path d="M9.2 7.4c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.2.2 2 3.1 4.9 4.3 2.4 1 2.9.8 3.4.8.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3l-2-.9c-.3-.1-.5-.1-.7.2l-.9 1.1c-.2.2-.4.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.1-.3 0-.4.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.1Z" />
            </svg>
        );
    }

    if (id === "linkedin") {
        return (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.6h.1c.5-.9 1.8-1.9 3.7-1.9 3.9 0 4.6 2.4 4.6 5.6V21h-4v-6c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21H9V9Z" />
            </svg>
        );
    }

    if (id === "github") {
        return (
            <svg viewBox="0 0 19 19" fill="currentColor" aria-hidden="true" focusable="false">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844"
                />
            </svg>
        );
    }

    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
            focusable="false"
        >
            <circle cx="12" cy="12" r="9" />
        </svg>
    );
}

export default function Contact() {
    const { t } = useLanguage();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const [status, setStatus] = useState(null);

    const onSubmit = async (data) => {
        setStatus("sending");
        try {
            await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID,
                {
                    from_name: data.name,
                    from_email: data.email,
                    reply_to: data.email,
                    message: data.message,
                },
                { publicKey: PUBLIC_KEY }
            );
            setStatus("ok");
            reset();
        } catch (err) {
            console.error("EmailJS error:", err);
            setStatus("err");
        }
    };

    return (
        <div className="page contact-page">
            <header className="page-head">
                <span className="page-head__kicker">04 — {t.nav.contact}</span>
                <h1>{t.contact.title}</h1>
                <p className="page-head__sub">{t.contact.subtitle}</p>
                <Ornament />
            </header>

            <div className="contact">
                <aside className="contact__channels">
                    <h2>{t.contact.channels}</h2>
                    <ul className="contact__list">
                        {contactLinks.map((link) => (
                            <li key={link.id}>
                                <a
                                    href={link.href}
                                    target={
                                        link.href.startsWith("http")
                                            ? "_blank"
                                            : undefined
                                    }
                                    rel="noreferrer"
                                >
                                    <span className="contact__channel-icon">
                                        <ChannelIcon id={link.id} />
                                    </span>
                                    <span className="contact__channel-label">
                                        {link.label}
                                    </span>
                                    <span
                                        className="contact__channel-arrow"
                                        aria-hidden="true"
                                    >
                                        ↗
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </aside>

                <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <label>
                        {t.contact.name}
                        <input
                            type="text"
                            {...register("name", {
                                required: t.contact.required,
                            })}
                        />
                        {errors.name && (
                            <span className="form__error">
                                {errors.name.message}
                            </span>
                        )}
                    </label>

                    <label>
                        {t.contact.email}
                        <input
                            type="email"
                            {...register("email", {
                                required: t.contact.required,
                                pattern: {
                                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                                    message: t.contact.invalidEmail,
                                },
                            })}
                        />
                        {errors.email && (
                            <span className="form__error">
                                {errors.email.message}
                            </span>
                        )}
                    </label>

                    <label>
                        {t.contact.message}
                        <textarea
                            rows={5}
                            {...register("message", {
                                required: t.contact.required,
                                minLength: {
                                    value: 10,
                                    message: t.contact.minMessage,
                                },
                            })}
                        />
                        {errors.message && (
                            <span className="form__error">
                                {errors.message.message}
                            </span>
                        )}
                    </label>

                    <button
                        className="btn"
                        type="submit"
                        disabled={status === "sending"}
                    >
                        {status === "sending"
                            ? t.contact.sending
                            : t.contact.send}
                    </button>

                    {status === "ok" && (
                        <p className="form__status form__status--ok">
                            {t.contact.success}
                        </p>
                    )}
                    {status === "err" && (
                        <p className="form__status form__status--err">
                            {t.contact.error}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
