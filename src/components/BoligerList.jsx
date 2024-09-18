import React, { useEffect, useState } from 'react';
import { useSupabase } from '../providers/SupabaseProvider'; 
import { Link } from 'react-router-dom';


export const BoligerList = () => {
    const { supabase } = useSupabase(); 
    const [bolig, setBolig] = useState([]);
  
    useEffect(() => {
      const fetchBolig = async () => {
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
            .eq('estate_image_rel.is_primary', true) // Fetch only primary images
  
          if (error) {
            console.error('Error fetching properties:', error);
          } else {

            setBolig(data);
          }
        }
      };
  
      fetchBolig();
    }, [supabase]);


    const formatPrice = (price) => {
        return price.toLocaleString('da-DK', {
          style: 'currency',
          currency: 'DKK'
        });
      };
  
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-10 justify-center gap-8 mx-10 my-10'>
       
        {bolig.map((bolig) => (
        <Link to={`/boliger/${bolig.id}`}>
          <div
            key={bolig.id}
            className='max-w-sm bg-white rounded-lg shadow-md overflow-hidden'
          >
            {/* Image Section */}
            <img
              src={bolig.estate_image_rel[0]?.image_id?.image_url}
              alt={bolig.address}
              className='w-full h-48 object-cover'
            />
  
            {/* Card Details */}
            <div className='p-4'>
            <div className='flex justify-between items-center '>
                    <h2 className="text-xl font-semibold mb-2">{bolig.address}</h2>
                    <div className='w-[26px] h-[26px] text-center' style={{ backgroundColor: `#${bolig.energy_labels.color}` }}> {bolig.energy_labels?.letter || 'N/A'}</div>
                </div>
                <p className="text-sm text-gray-600">{bolig.cities.name}</p>
                <p className="text-sm text-gray-600">{bolig.cities.zipcode}</p>
                <p className="text-sm text-gray-600">{bolig.estate_types.name}</p>
              <p className="text-gray-700">Værelser: {bolig.num_rooms}</p>
              <p className="text-gray-700">Floor space: {bolig.floor_space} m²</p>
             
  
              <div className="text-right mt-4">
                <span className="text-heading-2 font-semibold">{formatPrice(bolig.price)}</span>
              </div>

            </div>
            
          </div>
          </Link>
        ))}
      </div>
      
    );
  };
  