import React from 'react';
import { EstateCard } from '../components/EstateCard';
import { Reviews } from '../components/Reviews';
import { Ansatte } from '../components/Ansatte';


export const Forside = () => {
  return (
    <main>
        <EstateCard />
        <Reviews />
        <Ansatte />
    </main>
  );
};

export default Forside;
