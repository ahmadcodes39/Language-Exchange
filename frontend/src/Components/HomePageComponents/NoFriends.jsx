import React from 'react';
import { FaUserFriends } from 'react-icons/fa';

const NoFriends = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h2 className="text-xl font-semibold text-primary mb-2">
        You have no friends
      </h2>
      <p className="text-secondary text-sm">
        Make friends and start learning new languages today!
      </p>
    </div>
  );
};

export default NoFriends;
