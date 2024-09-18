import React, { useEffect, useState } from 'react';
import { useSupabase } from '../providers/SupabaseProvider'; // Ensure correct hook usage
import { Link } from 'react-router-dom';

export const EstateCard = () => {
  const { supabase } = useSupabase(); // Access the Supabase client from the context
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      if (supabase) {
        const { data, error } = await supabase
          .from('estates')
          .select(`
            *,
              cities ( zipcode, name ),
              estate_types ( name ),
              energy_labels ( letter, color ),
              estate_image_rel (
                image_id (
                  image_url
                )
              )
          `)
          .eq('estate_image_rel.is_primary', true); // Fetch only primary images

        if (error) {
          console.error('Error fetching properties:', error);
        } else {
          const randomProperties = data.sort(() => 0.5 - Math.random()).slice(0, 3);
          setProperties(randomProperties);
        }
      }
    };

    fetchProperties();
  }, [supabase]);

  const formatPrice = (price) => {
    return price.toLocaleString('da-DK', {
      style: 'currency',
      currency: 'DKK'
    });
  };

  return (
    <div className='w-[1200px] mx-auto items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 py-8 justify-center gap-8 mt-60'>
      {/* Use slice to only show the first 3 properties */}
      {properties.map((property, index) => (
        <Link className='z-20' to={`/boliger/${property.id}`}>
        <div
          key={property.id}
          className={`max-w-sm bg-white rounded-lg shadow-md overflow-hidden  ${index === 1 ? 'lg:mt-[-20px]' : ''}`}
        >
          {/* Image Section */}
          <img
            src={property.estate_image_rel[0]?.image_id?.image_url || 'default-image-url.jpg'}
            alt={property.address}
            className='w-full h-48 object-cover'
          />

          {/* Card Details */}
          <div className='p-4'>
          <div className='flex justify-between items-center '>
              <h2 className="text-xl font-semibold mb-2">{property.address}</h2>
              <div className='w-[26px] h-[26px] text-center' style={{ backgroundColor: `#${property.energy_labels.color}` }}> {property.energy_labels?.letter || 'N/A'}</div>
          </div>
              <p className="text-sm text-gray-600">{property.cities.zipcode} {property.cities.name}</p>
              <p className="text-sm text-gray-600">{property.estate_types.name}</p>
              <p className="text-gray-700">{property.num_rooms} værelser, {property.floor_space}m²</p>
              <p className="text-gray-700"> </p>
              <div className="text-right mt-4">
                <span className="text-lg font-semibold">{formatPrice(property.price)} DKK</span>
              </div>
          </div>
        </div>
        </Link>
      ))}
    </div>
  );
};
