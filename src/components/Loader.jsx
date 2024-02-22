import React from 'react';

const Loader = ({ isLoading }) => {
  return (
    <>
      {isLoading && (
        <div className='fixed top-0 left-0 z-50 h-screen w-full flex justify-center items-center bg-gray-400 bg-opacity-25'>
          <span className="loading loading-spin loading-lg text-success"></span>
        </div>
      )}
    </>
  );
};

export default Loader;
