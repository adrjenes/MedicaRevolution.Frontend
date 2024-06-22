import React from 'react';
import { useToken } from '../token/TokenContext';

const Home: React.FC = () => {
  const { token } = useToken();

  return (
    <div className="text-white break-words">
      <h1>Home</h1>
      <p>Your token is: {token}</p>
    </div>
  );
};

export default Home;