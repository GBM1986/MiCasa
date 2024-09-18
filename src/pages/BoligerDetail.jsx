import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSupabase } from '../providers/SupabaseProvider';
import moment from 'moment';
//https://momentjs.com/
export const BoligerDetail = () => {

    const { id } = useParams();
    const { supabase } = useSupabase();
    const [ boligerDetail, setBoligDetail ] = useState(null);

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
                  estate_types ( name ),
                  employees ( firstname, lastname, position, image_url, phone, email ),
                  energy_labels ( letter, color ),
                  estate_image_rel (
                    image_id (
                      image_url
                    )
                  )
                `)
                .eq('estate_image_rel.is_primary', true) // Fetch only primary images
                .eq('id', id)

            if (error) {
                console.error('Error fetching properties:', error);
            } else {
                setBoligDetail(data[0]);
            }
        };

        fetchBoligDetail();
    }, [supabase, id]);

    const formatPrice = (price) => {
        return price.toLocaleString('da-DK', {
          style: 'currency',
          currency: 'DKK'
        });
      };

  return (
    <div>
        {boligerDetail && (
          <div>
            <img src={boligerDetail.estate_image_rel[0]?.image_id?.image_url} alt={boligerDetail.address} className='w-full h-[800px] object-cover z-0 mt-[-180px] lg:mt-[-120px]' />
            <div className='relative w-[1440px] mx-auto bg-white flex justify-between border-r-black border-l-black border border-t-black border-b-0 p-6 font-poppins mt-[-160px] z-50 '>
              <section className='Address & size info space-y-1 '>
                <h1 className='text-heading-1'>{boligerDetail.address}</h1>
                <h3 className='text-heading-3'>{boligerDetail.cities.zipcode} {boligerDetail.cities.name}</h3>
                <h3 className='text-heading-3'>{boligerDetail.estate_types.name} | {boligerDetail.floor_space}m² | {boligerDetail.num_rooms} vær</h3>
                <h3 className='text-heading-3'>Set {boligerDetail.num_clicks} gange</h3>                
              </section>

              <section>

              </section>
                
              <section className='Economy info  space-y-1'>
                <h3 className='text-heading-3'>kontantpris: <strong className='text-heading-1'>{formatPrice(boligerDetail.price)}</strong></h3>
                <h3 className='text-heading-3'>Udbetaling: {formatPrice(boligerDetail.payout)}</h3>
                <h3 className='text-heading-3'>Ejerudgift per måned: {formatPrice(boligerDetail.cost)}</h3>
              </section>
            </div>

          <div className='flex flex-row justify-between w-[1440px] mx-auto p-6 border-r-black border-l-black border border-b-0 border-t-0'>
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
              <p className='flex justify-between'>Energimærke <span className='p-1 text-center' style={{ backgroundColor: `#${boligerDetail.energy_labels.color}` }}>{boligerDetail.energy_labels.letter}</span></p>
              <p className='flex justify-between'>Liggetid <span>{boligerDetail.created_at? moment(boligerDetail.created_at).fromNow() : 'N/A'}</span></p>
            </section>

            <section className='w-64 text-body font-poppins space-y-1'>
              <p className='flex justify-between'>Kontantpris <span>{boligerDetail.price}</span></p>
              <p className='flex justify-between'>Udbetaling <span>{boligerDetail.payout}</span></p>
              <p className='flex justify-between'>Brutto ex. ejerudgift <span>{formatPrice(boligerDetail.gross)}</span></p>
              <p className='flex justify-between'>Netto ex. ejerudgift <span>{formatPrice(boligerDetail.net)}</span></p>
              <p className='flex justify-between'>Ejerudgift <span>{formatPrice(boligerDetail.cost)}</span></p>
            </section>
            </div>

            <div className='flex flex-row justify-between w-[1440px] mx-auto p-6 border-r-black border-l-black border border-b-black border-t-0 mb-10'>
              <section>
                <p  style={{ whiteSpace: 'pre-line' }}>{boligerDetail.description}</p>
              </section>
            </div>
          </div>
        )}
    </div>
  )
}
