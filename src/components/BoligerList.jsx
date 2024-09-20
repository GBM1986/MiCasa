import React, { useEffect, useState } from 'react';
import Select from 'react-select'; // Ensure you have react-select installed
import { useSupabase } from '../providers/SupabaseProvider';
import { Link } from 'react-router-dom';

export const BoligerList = () => {
  const { supabase } = useSupabase();
  const [bolig, setBolig] = useState([]);
  const [filteredBolig, setFilteredBolig] = useState([]);
  const [propertyType, setPropertyType] = useState(null);
  const [sortOption, setSortOption] = useState(null);

  // Fetch all data including property types
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
          .eq('estate_image_rel.is_primary', true);

        if (error) {
          console.error('Error fetching properties:', error);
        } else {
          setBolig(data);
          setFilteredBolig(data); // Initialize filteredBolig with all data
        }
      }
    };

    fetchBolig();
  }, [supabase]);

  // Filter by property type
  useEffect(() => {
    let filtered = [...bolig];
    if (propertyType) {
      filtered = filtered.filter(item => item.estate_types.name === propertyType);
    }
    if (sortOption) {
      filtered.sort((a, b) => {
        switch (sortOption.value) {
          case 'price-ascending':
            return a.price - b.price;
          case 'price-descending':
            return b.price - a.price;
          case 'floor-space':
            return b.floor_space - a.floor_space;
          case 'days-on-market':
            return b.days_on_market - a.days_on_market;
          default:
            return 0;
        }
      });
    }
    setFilteredBolig(filtered);
  }, [propertyType, sortOption, bolig]);

  const propertyOptions = [
    { value: null, label: 'All Types' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Andelsbolig', label: 'Andelsbolig' },
    { value: 'Ejerlejlighed', label: 'Ejerlejlighed' }
    // Add more options based on your Supabase data
  ];

  const sortOptions = [
    { value: null, label: 'All Types' },
    { value: 'price-descending', label: 'Pirs - Stigende' },
    { value: 'price-ascending', label: 'Pris - Faldende' },    
    { value: 'floor-space', label: 'Antal kvadratmeter' },
    { value: 'days-on-market', label: 'Liggetid - Faldende' }
  ];

  const handlePropertyTypeChange = (selectedOption) => {
    setPropertyType(selectedOption?.value || null);
  };

  const handleSortChange = (selectedOption) => {
    setSortOption(selectedOption);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('da-DK', {
      style: 'currency',
      currency: 'DKK'
    });
  };

  return (
    <div className='px-10'>
      <div className='flex justify-end gap-4 mb-6 w-full'>
        <Select
          options={propertyOptions}
          onChange={handlePropertyTypeChange}
          placeholder="Select Property Type"
          className='w-52'
        />
        <Select
          options={sortOptions}
          onChange={handleSortChange}
          placeholder="Sort By"
          className='w-52'
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {filteredBolig.map((item) => (
          <Link key={item.id} to={`/boliger/${item.id}`}>
            <div className='max-w-sm bg-white rounded-lg shadow-md overflow-hidden'>
              {/* Image Section */}
              <img
                src={item.estate_image_rel[0]?.image_id?.image_url || 'default-image-url'}
                alt={item.address || 'No Address'}
                className='w-full h-48 object-cover'
              />

              {/* Card Details */}
              <div className='p-4'>
                <div className='flex justify-between items-center'>
                  <h2 className="text-xl font-semibold mb-2">{item.address || 'No Address'}</h2>
                  <div
                    className='w-[26px] h-[26px] text-center'
                    style={{ backgroundColor: `#${item.energy_labels?.color || 'FFFFFF'}` }}
                  >
                    {item.energy_labels?.letter || 'N/A'}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{item.cities?.name || 'No City'}</p>
                <p className="text-sm text-gray-600">{item.cities?.zipcode || 'No Zipcode'}</p>
                <p className="text-sm text-gray-600">{item.estate_types?.name || 'No Type'}</p>
                <p className="text-gray-700">Værelser: {item.num_rooms || 'N/A'}</p>
                <p className="text-gray-700">Floor space: {item.floor_space || 'N/A'} m²</p>

                <div className="text-right mt-4">
                  <span className="text-heading-2 font-semibold">{formatPrice(item.price) || 'N/A'}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
