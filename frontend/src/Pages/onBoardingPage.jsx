import React, { useState } from "react";
import { completeOnBoarding, getAuthUser } from "../lib/api.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Camera, Globe, Shuffle } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser.js";
import { LANGUAGES } from "../constants";
import { useNavigate } from "react-router";

const OnBoardingPage = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();
  const [formData, setFormData] = useState({
    name: authUser.name || "",
    Bio: authUser?.Bio || "",
    location: authUser?.location || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    profilePicture: authUser?.profilePicture || "",
  });

  const { mutate: onBoardingMutation, isPending } = useMutation({
    mutationFn: completeOnBoarding,
    onSuccess: () => {
      toast.success("Profile onBoarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authMe"] });
      
    },
    onError: (error) => {
      toast.error(`Failed to onboard profile: ${error.message}`);
      console.log(error.response.data.message)
      // queryClient.invalidateQueries({ queryKey: ["authMe"] });
    },
  });

  console.log("User data from getAuthUser:", authUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeAvatar = () => {
    const index = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${index}`;
    setFormData((prev) => ({
      ...prev,
      profilePicture: randomAvatar,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onBoardingMutation(formData);
  };

  return (
    <div
      className="flex flex-col justify-center items-center bg-base-100 p-10"
    >
      <div className="card max-w-3xl bg-base-200 shadow-xl card-bordered border-primary/25">
        <div className="card-body p-6 sm:p-8">
          <h1 className="font-bold text-2xl text-gray-200 text-center">
            Complete Your Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6 form-control">
            <div className="flex flex-col items-center justify-center space-y-4">
              {formData.profilePicture ? (
                <img
                  src={formData.profilePicture}
                  alt="Profile"
                  className="w-20 h-20 overflow-hidden rounded-full object-cover"
                />
              ) : (
                <div className="flex justify-center items-center h-full">
                  <Camera className="w-20 h-20 text-base-content opacity-40 rounded-full border border-primary p-2" />
                </div>
              )}
              <button
                className="btn btn-secondary btn-outline"
                onClick={handleChangeAvatar}
              >
                <Shuffle /> Generat Random Avatar
              </button>
              <div className="space-y-7"></div>
            </div>
            <div className="flex flex-col justify-start items-start gap-2">
              <label htmlFor="Name" className="text-xs label-text">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="JohnDoe"
                className="input input-secondary w-full rounded focus:outline-none "
              />
            </div>
            <div>
              <label htmlFor="Bio" className="label-text text-xs">
                Bio
              </label>
              <textarea
                name="Bio"
                value={formData.Bio}
                onChange={handleChange}
                rows={3}
                required
                placeholder="Write a short Bio..."
                className="textarea textarea-secondary w-full text-sm rounded focus:outline-none"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="nativeLanguage" className="label-text text-xs">
                  Native Language
                </label>
                <select
                  name="nativeLanguage"
                  value={formData.nativeLanguage}
                  onChange={handleChange}
                  required
                  className="select select-secondary text-sm h-9 py-1 rounded w-full focus:outline-none"
                >
                  <option value="" disabled>
                    Select language
                  </option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="learningLanguage"
                  className="label-text text-xs"
                >
                  Learning Language
                </label>
                <select
                  name="learningLanguage"
                  value={formData.learningLanguage}
                  onChange={handleChange}
                  required
                  className="select select-secondary text-sm h-9 py-1 rounded w-full focus:outline-none"
                >
                  <option value="" disabled>
                    Select language
                  </option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learn-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-2">
              <label htmlFor="Name" className="text-xs label-text">
                Location
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="location"
                className="input input-secondary w-full rounded focus:outline-none"
              />
            </div>
            <button
              className="btn btn-primary w-full mt-3 mb-2"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <span className="loading loading-spinner text-secondary">
                  Loading...
                </span>
              ) : (
                <div className="flex justify-center items-center gap-2">
                  <Globe className="text-xs" />
                  <p>Complete onBoarding</p>
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnBoardingPage;
