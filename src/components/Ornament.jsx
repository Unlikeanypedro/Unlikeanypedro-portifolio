// Decorative flourish used across the portfolio, echoing the Hollow Knight menu frame.
export default function Ornament({ className = "" }) {
    return (
        <svg
            className={`ornament ${className}`.trim()}
            viewBox="0 0 560 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            aria-hidden="true"
        >
            <path d="M12 20h176" opacity="0.45" />
            <path d="M372 20h176" opacity="0.45" />
            <path d="M188 20c8-12 20-12 28 0s20 12 28 0" />
            <path d="M372 20c-8-12-20-12-28 0s-20 12-28 0" />
            <path d="M280 13l7 7-7 7-7-7z" fill="currentColor" stroke="none" />
            <circle cx="252" cy="20" r="1.7" fill="currentColor" stroke="none" />
            <circle cx="308" cy="20" r="1.7" fill="currentColor" stroke="none" />
        </svg>
    );
}
