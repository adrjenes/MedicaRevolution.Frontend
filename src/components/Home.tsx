import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-3xl text-center">
      <div>
        Witaj w aplikacji medycznej <span className="text-violet-500">MedicaRevolution.</span>
      </div>
      <div className="pt-8">
        Przejdź do odpowiedniej zakładki.
      </div>
    </div>
  );
};

export default Home;