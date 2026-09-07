import { useState, type SyntheticEvent, } from "react";
import { Link, useNavigate, } from "react-router-dom";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { register, } from "../../api/userApi";

const Register = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);


    const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            await register({ username, email, password, });

            navigate("/login");

        } catch (error) {

            console.error("Registration failed", error);

            setError("Registration failed. Username or email may already exist.");

        } finally {

            setLoading(false);
        }
    };


    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">

            <div className="w-full max-w-md">
                <div className="mb-8 text-center">

                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white shadow-lg shadow-indigo-600/20">
                        N
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        NovaChat
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Connect. Chat. Stay close.
                    </p>

                </div>


                {/* Register Card */}

                <div className="rounded-2xl bg-white p-8 shadow-2xl">

                    <div className="mb-6">

                        <h2 className="text-2xl font-semibold text-slate-900">
                            Create your account
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Join NovaChat and start connecting.
                        </p>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <Input
                            label="Username"
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            minLength={3}
                            maxLength={50}
                            required
                        />


                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            required
                        />


                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            minLength={8}
                            maxLength={100}
                            required
                        />


                        {error && (
                            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}


                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating account..."
                                : "Create account"}
                        </Button>

                    </form>


                    <div className="mt-6 text-center text-sm text-slate-500">

                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            Sign in
                        </Link>

                    </div>

                </div>

            </div>

        </main>
    );
};

export default Register;