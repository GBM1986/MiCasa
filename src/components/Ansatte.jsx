import React, { useEffect, useState } from 'react';
import { useSupabase } from '../providers/SupabaseProvider';
import './Ansette.scss';

export const Ansatte = () => {
  const { supabase } = useSupabase();
  const [ansatte, setAnsatte] = useState([]);

  useEffect(() => {
    const fetchAnsatte = async () => {
      if (supabase) {
        const { data, error } = await supabase.from('employees').select('*');
        if (error) {
          console.error('Error fetching employees:', error);
        } else {
          setAnsatte(data);
        }
      }
    };

    fetchAnsatte();
  }, [supabase]);

  return (
    <div className='ansatte'>
      <h1>Mød vores ansatte</h1>
      <div className='employee-list'>
        {ansatte.map((ansatt) => (
          <div key={ansatt.id} className='employee-card'>
            <img src={ansatt.image_url} alt={ansatt.firstname} />
            <div className='info-overlay'>
              <div className='text-overlay'>
                <figcaption>{ansatt.firstname} {ansatt.lastname}</figcaption>
                <p>{ansatt.position}</p>
              
              
                <p>Email: {ansatt.email}</p>
                <p>Mobil: {ansatt.phone}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
