import React from "react";

const RecommendedUserTopBar = () => {
  return (
    <section>
      <div className="mb-6 sm:mb-8 sm: mt-3 px-6">
        <div className="flex sm:items-start sm:flex justify-between flex-col gap-4">
          <div>
            <h2 className="tracking-tight font-semibold text-2xl sm:text-3xl">
              Meet New Learners
            </h2>
            <p className="opacity-70">
              Discover perfect language exchange partner based on your profile
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendedUserTopBar;
