import React from 'react';
import { FaUserPlus } from 'react-icons/fa';

const NoRecommendedUsers = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4">
      <div className="bg-primary/10 text-primary p-4 rounded-full mb-4 shadow-md">
        <FaUserPlus size={30} />
      </div>
      <h2 className="text-xl font-semibold text-primary mb-2">
        No recommended users found
      </h2>
      <p className="text-secondary text-sm">
        Check back later to discover new people to connect with!
      </p>
    </div>
  );
};

export default NoRecommendedUsers;
