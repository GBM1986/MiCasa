import React, { useState, useEffect } from 'react';

export const Map = ({ address, zipcode, city }) => {
  const [mapSrc, setMapSrc] = useState('');

  useEffect(() => {
    if (address && zipcode && city) {
      // Combine the address, zipcode, and city into one string
      const fullAddress = `${address}, ${zipcode} ${city}`;

      // Encode the full address for use in the URL
      const encodedAddress = encodeURIComponent(fullAddress);

      // Set the dynamic Google Maps URL with the address and your API key
      const dynamicMapSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSyDV1RnrqIhlQ--hpVg6O8y6UjX4vqMQ8yQ&q=${encodedAddress}`;

      setMapSrc(dynamicMapSrc);
    }
  }, [address, zipcode, city]);


  return (
    <div>
      {mapSrc ? (
        <iframe
          src={mapSrc}
          width="600"
          height="450"
          allowFullScreen
          referrerPolicy="no-referrer"
          style={{ border: '0px' }}
        ></iframe>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
};
