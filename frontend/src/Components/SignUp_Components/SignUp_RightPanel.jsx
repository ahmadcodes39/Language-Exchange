import React from "react";

const SignUp_RightPanel = () => {
  return (
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
  );
};

export default SignUp_RightPanel;