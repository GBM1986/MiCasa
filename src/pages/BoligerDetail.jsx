import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSupabase } from '../providers/SupabaseProvider';
import Modal from 'react-modal';
import moment from 'moment'; //https://momentjs.com/
import cameraIcon from '../assets/Images/Icons/Property1=Default.png';
import cameraIconHover from '../assets/Images/Icons/Property1=Hover.png';
import floorplan from '../assets/Images/Icons/Floorplan-Default.png';
import floorplanHover from '../assets/Images/Icons/Floorplan-Hover.png';
import locationDefault from '../assets/Images/Icons/Location-Default.png';
import locationHover from '../assets/Images/Icons/Location-Hover.png';
import heartDefault from '../assets/Images/Icons/Heart-Default.png';
import heartHover from '../assets/Images/Icons/Heart-Hover.png';
import heartActive from '../assets/Images/Icons/Heart-Checked.png';

export const BoligerDetail = () => {
  const { id } = useParams();
  const { supabase, user } = useSupabase();
  const [boligerDetail, setBoligDetail] = useState(null);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [isFloorplanModalOpen, setFloorplanModalOpen] = useState(false);
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const [isHeartActive, setIsHeartActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBoligDetail = async () => {
      if (!supabase) {
        console.error('Supabase client is not initialized');
        return;
      }

      const { data, error } = await supabase
        .from('estates')
        .select(`
          *,
          cities ( zipcode, name ),
          favorites ( estate_id, user_id ),
          estate_types ( name ),
          employees ( firstname, lastname, position, image_url, phone, email ),
          energy_labels ( letter, color ),
          estate_image_rel (
            image_id (
              image_url
            ),
          is_primary
          )
        `)
        .eq('id', id);

      if (error) {
        console.error('Error fetching properties:', error);
      } else {
        setBoligDetail(data[0]);

        const isFavorite = data[0]?.favorites?.some(fav => fav.user_id === user?.id);
        setIsHeartActive(isFavorite);
      }
    };

    fetchBoligDetail();
  }, [supabase, id, user]);

  const handleHeartClick = async () => {
    if (loading || !user) {
      console.error('User not authenticated or action in progress');
      return; // Prevent multiple requests or if not logged in
    }
    
    setLoading(true);
  
    try {
      if (isHeartActive) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('estate_id', id)
          .eq('user_id', user.id); // Only delete this user's favorite
  
        if (error) {
          console.error('Error removing favorite:', error);
        } else {
          console.log('Favorite removed successfully');
          setIsHeartActive(false);
        }
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({ estate_id: id, user_id: user.id });
  
        if (error) {
          console.error('Error adding favorite:', error);
        } else {
          console.log('Favorite added successfully');
          setIsHeartActive(true);
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false); // Re-enable the button after the request
    }
  };
  

  const handleImageModalOpen = () => setImageModalOpen(true);
  const handleImageModalClose = () => setImageModalOpen(false);

  const handleFloorplanModalOpen = () => setFloorplanModalOpen(true);
  const handleFloorplanModalClose = () => setFloorplanModalOpen(false);

  const handleLocationModalOpen = () => setLocationModalOpen(true);
  const handleLocationModalClose = () => setLocationModalOpen(false);

  const formatPrice = (price) => {
    return price.toLocaleString('da-DK', {
      style: 'currency',
      currency: 'DKK',
    });
  };

  return (
    <div >
      {boligerDetail && (
        <div >
          <img
            src={boligerDetail.estate_image_rel[0]?.image_id?.image_url}
            alt={boligerDetail.address}
            className='w-full h-[800px] object-cover z-0 mt-[-250px] lg:mt-[-220px]'
          />
          <div className='relative w-[400px] lg:w-[1440px] xl:w-[1440px] 2xl:w-[1440px] mx-auto flex flex-col  lg:flex-row xl:flex-row 2xl:flex-row bg-white justify-between border-r-black border-l-black border border-t-black border-b-0 p-6 font-poppins mt-[-160px]'>
            <section className='Address & size info space-y-1'>
              <h1 className='text-heading-1'>{boligerDetail.address}</h1>
              <h3 className='text-heading-3'>
                {boligerDetail.cities.zipcode} {boligerDetail.cities.name}
              </h3>
              <h3 className='text-heading-3'>
                {boligerDetail.estate_types.name} | {boligerDetail.floor_space}m² | {boligerDetail.num_rooms} vær
              </h3>
              <h3 className='text-heading-3'>Set {boligerDetail.num_clicks} gange</h3>
            </section>

            <section className='flex flex-col  lg:flex-row xl:flex-row 2xl:flex-row lg:space-x-8 xl:space-x-8 2xl:space-x-8'>
              <div>
                <button className="relative" onClick={handleImageModalOpen}>
                  <img
                    src={cameraIcon}
                    alt="Default Icon"
                    className="transition-opacity duration-300 opacity-100 hover:opacity-0"
                  />
                  <img
                    src={cameraIconHover}
                    alt="Hover Icon"
                    className="absolute inset-0 transition-opacity duration-300 opacity-0 hover:opacity-100"
                  />
                </button>
                <Modal isOpen={isImageModalOpen} onRequestClose={handleImageModalClose}>
                  <div className='flex flex-col p-6 gap-4 mt-40'>
                    {boligerDetail.estate_image_rel.map((image) => (
                      <img
                        key={image.image_id.image_url}
                        src={image.image_id.image_url}
                        alt="Bolig Image"
                        className='flex object-cover' // Adjust size as needed
                      />
                    ))}
                  </div>
                  <button className='bg-rose-quartz text-white font-poppins rounded-md shadow-md px-4 py-2 hover:bg-thistle mt-4' onClick={handleImageModalClose}>Close</button>
                </Modal>
              </div>

              <div>
                <button className="relative" onClick={handleFloorplanModalOpen}>
                  <img
                    src={floorplan}
                    alt="Default Icon"
                    className="transition-opacity duration-300 opacity-100 hover:opacity-0"
                  />
                  <img
                    src={floorplanHover}
                    alt="Hover Icon"
                    className="absolute inset-0 transition-opacity duration-300 opacity-0 hover:opacity-100"
                  />
                </button>
                <Modal className={`h-full flex flex-col align-middle items-center justify-center`} isOpen={isFloorplanModalOpen} onRequestClose={handleFloorplanModalClose}>
                  <div className='z-50'>
                    <img src={boligerDetail.floorplan} alt="Floorplan Image" />
                  </div>
                  <button className='bg-rose-quartz text-white font-poppins rounded-md shadow-md px-4 py-2 hover:bg-thistle mt-4' onClick={handleFloorplanModalClose}>Close</button>
                </Modal>
              </div>

              <div>
                <button className="relative" onClick={handleLocationModalOpen}>
                  <img
                    src={locationDefault}
                    alt="Default Icon"
                    className="transition-opacity duration-300 opacity-100 hover:opacity-0"
                  />
                  <img
                    src={locationHover}
                    alt="Hover Icon"
                    className="absolute inset-0 transition-opacity duration-300 opacity-0 hover:opacity-100"
                  />
                </button>
                <Modal className={`h-full flex flex-col align-middle items-center justify-center`} isOpen={isLocationModalOpen} onRequestClose={handleLocationModalClose}>
                  <div className='z-50'>
                    <iframe
                      src={`https://maps.google.com/maps?q=${boligerDetail.latitude},${boligerDetail.longitude}&z=15&output=embed`}
                      width="500"
                      height="300"
                      allowFullScreen=""
                      loading="lazy"
                      title="station-map"
                    ></iframe>
                  </div>
                  <button className='bg-rose-quartz text-white font-poppins rounded-md shadow-md px-4 py-2 hover:bg-thistle mt-4' onClick={handleLocationModalClose}>Close</button>
                </Modal>
              </div>

              <div>
                <button className="relative" onClick={handleHeartClick} disabled={loading}>
                  <img
                    src={heartDefault}
                    alt="Heart Icon"
                    className={`transition-opacity duration-300 ${isHeartActive ? 'opacity-0' : 'opacity-100'} hover:opacity-0`}
                  />
                  <img
                    src={heartHover}
                    alt="Hover Icon"
                    className={`absolute inset-0 transition-opacity duration-300 ${isHeartActive ? 'opacity-100' : 'opacity-0'} hover:opacity-100`}
                  />
                  <img
                    src={heartActive}
                    alt="Active Icon"
                    className={`absolute inset-0 transition-opacity duration-300 ${isHeartActive ? 'opacity-100' : 'opacity-0'}`}
                  />
                </button>
              </div>
            </section>
          
            <section className='Economy info flex flex-col'>
              <h3 className='text-heading-3 flex justify-between items-center w-52 '>
                kontantpris: <strong className='text-heading-1'>{formatPrice(boligerDetail.price)}</strong>
              </h3>
              <h3 className='text-heading-3 flex justify-between w-52'>Udbetaling: <span>{formatPrice(boligerDetail.payout)}</span></h3>
              <h3 className='text-heading-3 flex justify-between w-80'>Ejerudgift per måned: <span>{formatPrice(boligerDetail.cost)}</span></h3>
            </section>
          </div>

          <div className='flex flex-col  lg:flex-row xl:flex-row 2xl:flex-row justify-between w-[400px] lg:w-[1440px] xl:w-[1440px] 2xl:w-[1440px] mx-auto p-6 border-r-black border-l-black border border-b-0 border-t-0'>
            <section className='w-52 text-body font-poppins space-y-1'>
              <p className='flex justify-between'>Sagsnr. <span>{boligerDetail.id}</span></p>
              <p className='flex justify-between'>Boligareal <span>{boligerDetail.floor_space}m²</span></p>
              <p className='flex justify-between'>Grundareal <span>{boligerDetail.ground_space}m²</span></p>
              <p className='flex justify-between'>Antal rum <span>{boligerDetail.num_rooms}</span></p>
              <p className='flex justify-between'>Antal plan <span>{boligerDetail.num_floors}</span></p>
            </section>

            <section className='w-52 text-body font-poppins space-y-1'>
              <p className='flex justify-between'>Kælder <span>{boligerDetail.basement_space}m²</span></p>
              <p className='flex justify-between'>Byggeår <span>{boligerDetail.year_construction}</span></p>
              <p className='flex justify-between'>Ombygget <span>{boligerDetail.year_rebuilt}</span></p>
              <p className='flex justify-between items-center'>
                Energimærke
                 {/* somethings need inline style to work (cant use Tailwindcss) */}
                <span className='px-2 py-1 text-center' style={{ backgroundColor: `#${boligerDetail.energy_labels.color}` }}> 
                  {boligerDetail.energy_labels.letter}
                </span>
              </p>
              <p className='flex justify-between'>Liggetid <span>{boligerDetail.created_at ? moment(boligerDetail.created_at).fromNow() : 'N/A'}</span></p>
            </section>

            <section className='w-64 text-body font-poppins space-y-1'>
              <p className='flex justify-between'>Kontantpris <span>{formatPrice(boligerDetail.price)}</span></p>
              <p className='flex justify-between'>Udbetaling <span>{formatPrice(boligerDetail.payout)}</span></p>
              <p className='flex justify-between'>Brutto ex. ejerudgift <span>{formatPrice(boligerDetail.gross)}</span></p>
              <p className='flex justify-between'>Netto ex. ejerudgift <span>{formatPrice(boligerDetail.net)}</span></p>
              <p className='flex justify-between'>Ejerudgift <span>{formatPrice(boligerDetail.cost)}</span></p>
            </section>
          </div>

          <div className='flex flex-row justify-between  w-[400px] lg:w-[1440px] xl:w-[1440px] 2xl:w-[1440px] mx-auto  p-6 border-r-black border-l-black border border-b-black border-t-0 mb-10'>
            <section className='flex flex-col  lg:flex-row xl:flex-row 2xl:flex-row  gap-6'>              
              <p className='w-[350px] md:w-[350px] lg:w-[1140px] xl:w-[1140px] 2xl:w-[1140px]' style={{ whiteSpace: 'pre-line' }}>{boligerDetail.description}</p> 
              <div className='w-[241px] h-[404px] space-y-1'>
                <h2 className='text-heading-1 font-bold'>Kontakt</h2>
                <img 
                  className='w-[186px] h-[204px]'
                  src={boligerDetail.employees.image_url} 
                  alt={boligerDetail.employees.firstname} 
                />
                <h3 className='text-heading-3 font-bold'>{boligerDetail.employees.firstname} {boligerDetail.employees.lastname}</h3>
                <p className='text-heading-4 font-semibold'>{boligerDetail.employees.position}</p>
                <p className='text-heading-4 font-semibold'>Mobil: {boligerDetail.employees.phone}</p>
                <p className='text-heading-4 font-semibold'>Email: {boligerDetail.employees.email}</p>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};
