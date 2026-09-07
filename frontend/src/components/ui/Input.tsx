import type {
    InputHTMLAttributes,
} from "react";

interface InputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = ({
    label,
    error,
    className = "",
    ...props
}: InputProps) => {

    return (
        <div className="space-y-1.5">

            {label && (
                <label className="block text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}

            <input
                className={`
                    w-full rounded-lg border border-slate-300
                    bg-white px-3 py-2.5 text-sm text-slate-900
                    outline-none transition
                    placeholder:text-slate-400
                    focus:border-indigo-500
                    focus:ring-2 focus:ring-indigo-500/20
                    ${className}
                `}
                {...props}
            />

            {error && (
                <p className="text-sm text-red-600">
                    {error}
                </p>
            )}

        </div>
    );
};

export default Input;