import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { signUp } from '../../lib/api.js';
import toast from 'react-hot-toast';
import { ShipWheel } from 'lucide-react';
import { Link } from 'react-router-dom';

const SignUp_LeftPanel = () => {
  const [agreed, setAgreed] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (formData) => signUp(formData),
    onSuccess: () => {
      toast.success("Signup successful! Redirecting...");
      queryClient.invalidateQueries(["authMe"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.message || "An error occurred during signup.");
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
    if (!agreed) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    mutate(data);
  };

  return (
    <div className="flex flex-col justify-start items-start border border-primary/25 rounded-l-xl p-6 bg-base-100 shadow-lg w-full md:w-1/2">
      <section className="flex justify-start items-center gap-2 mb-2">
        <ShipWheel className="size-9 text-primary" />
        <h1 className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
          Streamify
        </h1>
      </section>
      {error && (
        <div className="alert alert-error shadow-lg mb-2">
          <span className="text-white">
            {error.response?.data?.message ||
              error.message ||
              "An error occurred during signup."}
          </span>
        </div>
      )}
      <section className="flex flex-col items-start justify-start mb-4">
        <h2 className="text-2xl">Create an Account</h2>
        <p className="text-xs">
          Join LangConnect and start your language learning journey today
        </p>
      </section>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Full Name</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={data.name}
            onChange={handleChange}
            placeholder="JohnDoe"
            className="input input-bordered rounded-md w-full"
          />
        </div>
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
            className="input rounded-md input-bordered w-full"
          />
        </div>
        <div className="flex flex-col items-start justify-start">
          <p className="text-gray-300 text-sm mb-2">
            Password must be at least 6 characters long
          </p>
          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className="text-sm">
              I agree to the <span className="text-primary">terms</span> and{" "}
              <span className="text-primary">conditions</span>
            </span>
          </label>
        </div>
        <button
          className="btn btn-primary w-full mt-4 mb-2"
          type="submit"
          disabled={isPending}
        >
          {isPending ? (
            <span className="loading loading-spinner text-secondary">
              Loading...
            </span>
          ) : (
            "Create Account"
          )}
        </button>
        <p className="flex justify-center items-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="link p-1 link-primary">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp_LeftPanel;