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
      
      <div id="technology">
        <Technology />
      </div>

      <div id="sensors">
        <Sensors />
      </div>

      <div id="impact">
        <Impact />
      </div>
      
      {/* We keep Specs on home for flow, but also have a separate page */}
      <div id="specs">
        <Specs />
      </div>
    </main>
  );
};

export default Home;