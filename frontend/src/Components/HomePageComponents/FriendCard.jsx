import React from "react";
import { LANGUAGE_TO_FLAG } from "../../constants";
import { Link } from "react-router";

const FriendCard = ({ friend }) => {
  return (
    <>
    {/* {console.log("friend data: ",friend)} */}
    <div className="card bg-base-200 shadow-sm hover:shadow-md transition-colors">
      <div className="card-body p-5">
        {/* user info */}
        <div className="flex gap-3">
          <div className="avatar size-12">
            <img src={friend.profilePicture} alt={friend.name} />{" "}
          </div>
          <h3 className="font-semibold">{friend.name}</h3>
        </div>

        {/* languages badges */}
        <div className="flex flex-wrap gap-2 ">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        {/* message button */}
        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
            Message
        </Link>
      </div>
    </div>
    </>

  );
};

export default FriendCard;

const getLanguageFlag = (language) => {
  if (!language) return null;
  // const languageLower = language.toLowercase();
  const countryCode = LANGUAGE_TO_FLAG[language]; 

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt=""
        className="mr-1 size-3 inline-block"
      />
    );
  }
};
