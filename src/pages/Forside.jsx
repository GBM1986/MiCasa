import React from 'react';
import { EstateCard } from '../components/EstateCard';
import { Reviews } from '../components/Reviews';


export const Forside = () => {
  return (
    <main>
        <EstateCard />
        <Reviews />
    </main>
  );
};

export default Forside;
