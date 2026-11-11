import { useState } from "react";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { useLanguage } from "../context/LanguageContext.jsx";
import Ornament from "../components/Ornament.jsx";
import { contactLinks } from "../data/profile.js";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

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
                { publicKey: PUBLIC_KEY },
            );
            setStatus("ok");
            reset();
        } catch (err) {
            console.error("EmailJS error:", err);
            setStatus("err");
        }
    };

    return (
        <div className="page">
            <header className="page-head">
                <span className="page-head__kicker">04 — {t.nav.contact}</span>
                <h1>{t.contact.title}</h1>
                <p className="page-head__sub">{t.contact.subtitle}</p>
                <Ornament />
            </header>

            <div className="contact">
                <aside className="contact__channels">
                    <h2>{t.contact.channels}</h2>
                    <ul>
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
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </aside>

                <form
                    className="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
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
