import React from 'react';
import Hero from './Hero/Hero';
import Technology from './Technology/Technology';
import Sensors from './Sensors/Sensors';
import Impact from './Impact/Impact';
import Specs from './Specs/Specs';
import EcosystemMap from '../../components/ui/EcosystemMap';

const Home = () => {
  return (
    <main className="w-full bg-eko-bg selection:bg-eko-emerald selection:text-black">
      <Hero />
      
      {/* Added extra padding-top to separate the interactive Hero from the content */}
      <div className="relative z-10 bg-black">
        
        <div id="technology">
          <Technology />
        </div>

        <div id="sensors">
          <Sensors />
        </div>

        <EcosystemMap /> 

        <div id="impact">
          <Impact />
        </div>
        
        <div id="specs">
          <Specs />
        </div>
      </div>
    </main>
  );
};

export default Home;