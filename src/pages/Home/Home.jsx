import React from 'react';
import Hero from './Hero/Hero';
import Technology from './Technology/Technology';
import Sensors from './Sensors/Sensors';
import Impact from './Impact/Impact'; 
import Specs from './Specs/Specs';

const Home = () => {
  return (
    <main className="w-full bg-eko-bg">
      <Hero />
      <Technology />
      <Sensors />
      <Impact /> {/* <--- Render */}
      <Specs />
    </main>
  );
};

export default Home;