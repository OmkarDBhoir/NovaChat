import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "ghost" | "danger";
}

const Button = ({ children, variant = "primary", className = "", ...props }: ButtonProps) => {

    const baseStyles =
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    const variants = {
        primary:
            "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",

        secondary:
            "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-400",

        ghost:
            "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400",

        danger:
            "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;