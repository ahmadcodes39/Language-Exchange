import React from "react";
import { FaUserPlus } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { LANGUAGE_TO_FLAG } from "../../constants";

// ✅ Flag helper function
const getLanguageFlag = (language) => {
  if (!language) return null;
  const languageLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[languageLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${language} flag`}
        className="mr-1 size-3 inline-block"
      />
    );
  }

  return null;
};

const RecomendedUserCard = ({ user, onSendRequest, hasRequestBeenSent }) => {
  return (
    <div className="card bg-base-200 text-base-content shadow-lg p-5 rounded-2xl w-full max-w-lg mx-auto border border-gray-700">

      <div className="flex items-center gap-4 mb-3">
        <div className="avatar">
          <div className="w-12 rounded-full">
            <img src={user.profilePicture} alt={user.name} />
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-lg">{user.name}</h2>
          <div className="flex items-center text-sm text-secondary">
            <MdLocationOn className="mr-1" />
            {user.location}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="badge badge-success gap-1 p-3 items-center">
          {getLanguageFlag(user.nativeLanguage)}
          <span className="text-sm">Native: {user.nativeLanguage}</span>
        </span>
        <span className="badge badge-outline p-3 gap-1 items-center">
          {getLanguageFlag(user.learningLanguage)}
          <span className="text-sm">Learning: {user.learningLanguage}</span>
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-4">{user.Bio}</p>

      <button
        className={`btn w-full ${
          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
        }`}
        disabled={hasRequestBeenSent}
        onClick={() => onSendRequest(user._id)}
      >
        <FaUserPlus className="mr-2" />
        {hasRequestBeenSent ? "Request Sent" : "Send Friend Request"}
      </button>
    </div>
  );
};

export default RecomendedUserCard;
