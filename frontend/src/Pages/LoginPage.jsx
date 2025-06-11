import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { login } from '../lib/api.js';
import { ShipWheel } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (formData) => login(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["authMe"]);
    },
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(data);
  };

  return (
    <div
      className="h-screen flex justify-center items-center p-20 bg-base-200 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row rounded-xl overflow-hidden">
        {/* Left Panel */}
        <div className="flex flex-col justify-start items-start border border-primary/25 rounded-l-xl p-6 bg-base-100 shadow-lg w-full md:w-1/2">
          <section className="flex justify-start items-center gap-2 mb-1">
            <ShipWheel className="size-9 text-primary" />
            <h1 className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Learnify
            </h1>
          </section>
          {error && (
            <div className="alert alert-error shadow-lg mb-2">
              <span className="text-white">
                {error.response?.data?.message ||
                  error.message ||
                  "An error occurred during login."}
              </span>
            </div>
          )}
          <section className="flex flex-col items-start justify-start mb-4">
            <h2 className="text-2xl">Sign In</h2>
            <p className="text-xs">
              Welcome back to LangConnect! Log in to continue your journey
            </p>
          </section>
          <form onSubmit={handleSubmit} className="w-full space-y-2">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={data.email}
                onChange={handleChange}
                placeholder="hello@gmail.com"
                className="input input-bordered rounded-md w-full"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                required
                value={data.password}
                onChange={handleChange}
                placeholder="********"
                className="input rounded-md input-bordered w-full mb-4"
              />
            </div>
            <button
              className="btn btn-primary w-full mt-7 mb-2"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <span className="loading loading-spinner text-secondary">
                  Loading...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
            <p className="flex justify-center items-center text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="link p-1 link-primary">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
        {/* Right Panel */}
        <div className="hidden md:flex flex-col justify-center items-center border border-primary/25 rounded-r-xl p-6 bg-base-100 shadow-lg bg-primary/10 w-1/2">
          <img
            className="w-3/4 h-auto"
            src="/Video call.png"
            alt="Video call illustration"
          />
          <section className="flex flex-col items-center justify-center text-center mt-4">
            <p className="font-bold text-xl">
              Connect with language partners worldwide
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Practice conversation skills with native speakers and improve your
              fluency
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;