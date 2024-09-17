import React, { useEffect, useState } from 'react';
import { useSupabase } from '../providers/SupabaseProvider'; 
import { Link } from 'react-router-dom';

export const BoligerList = () => {
    const { supabase } = useSupabase(); 
    const [properties, setProperties] = useState([]);
  
    useEffect(() => {
      const fetchProperties = async () => {
        if (supabase) {
          const { data, error } = await supabase
            .from('estates')
            .select(`
              *,
              energy_labels ( letter ),
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

            setProperties(data);
          }
        }
      };
  
      fetchProperties();
    }, [supabase]);
  
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-10 justify-center gap-8 mx-10 my-10'>
       
        {properties.map((property, index) => (
        <Link to={`/bolgier/${estates.id}`}>
          <div
            key={property.id}
            className='max-w-sm bg-white rounded-lg shadow-md overflow-hidden'
          >
            {/* Image Section */}
            <img
              src={property.estate_image_rel[0]?.image_id?.image_url}
              alt={property.address}
              className='w-full h-48 object-cover'
            />
  
            {/* Card Details */}
            <div className='p-4'>
              <h2 className="text-xl font-semibold mb-2">{property.address}</h2>
              <p className="text-gray-700">Rooms: {property.num_rooms}</p>
              <p className="text-gray-700">Floor space: {property.floor_space} m²</p>
              <p className="text-gray-700">Energy Label: {property.energy_labels?.letter || 'N/A'}</p>
  
              <div className="text-right mt-4">
                <span className="text-lg font-semibold">{property.price} DKK</span>
              </div>
            </div>
          </div>
          </Link>
        ))}
      </div>
      
    );
  };
  