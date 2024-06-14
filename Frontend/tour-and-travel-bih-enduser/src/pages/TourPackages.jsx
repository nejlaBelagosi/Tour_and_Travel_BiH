import React from 'react';
import TourCards from '../components/TourPackagesCards';

import '../styles/TourPackage.css';

export default function TourPackages() {
  return (
    <div>
      <h1 style={{marginLeft:'20px', marginTop:'20px', marginBottom:'20px'}}>All Tour Packages</h1>
      <TourCards />
    </div>
  );
}
