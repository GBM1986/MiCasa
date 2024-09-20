import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSupabase } from '../providers/SupabaseProvider';

export const Kontakt = () => {
  const { supabase } = useSupabase();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [employees, setEmployees] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchEmployees = async () => {
      if (supabase) {
        const { data, error } = await supabase
          .from('employees')
          .select('id, firstname, lastname');

        if (error) {
          console.error('Error fetching employees:', error);
        } else {
          setEmployees(data);
        }
      }
    };

    fetchEmployees();
  }, [supabase]);

  const handleContact = async (data) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          name: data.name,
          message: data.message,
          employee_id: data.employeeId
        }]);

      if (error) {
        console.error('Error sending message:', error);
        return;
      }

      setFormSubmitted(true);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className='flex flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row'>
      <div className='flex-grow'>
        {formSubmitted ? (
          <div className='text-center mt-8'>
            <h1 className='text-2xl font-bold'>Dine spørgsmål er modtaget</h1>
            <p className='mt-4'>Tak for din besked! Vi vender tilbage til dig så hurtigt som muligt.</p>
          </div>
        ) : (
          <form className='max-w-xl mx-auto bg-white p-4 space-y-2' onSubmit={handleSubmit(handleContact)}>
            <h1 className='text-4xl'><strong>Kontakt</strong></h1>
            <p className='my-4 text-xs'>Udfyld og send formularen og vi vil hurtigst muligt besvare dine spørgsmål.</p>
            <div className='flex justify-between'>
              <label className='text-md self-center' htmlFor="name">Navn:</label>
              <input
                className='w-full max-w-[480px] p-2 border-2'
                placeholder='Indtast dit navn'
                type="text"
                id="name"
                {...register("name", { required: true })}
              />
              {errors.name && <div className="text-xs text-red-600">Navn er påkrævet</div>}
            </div>
            <div className='flex justify-between'>
              <label className='text-md self-center' htmlFor="employeeId">Ansat:</label>
              <select
                className='w-full max-w-[480px] p-2 border-2'
                id="employeeId"
                {...register("employeeId", { required: true })}
              >
                <option value="">Vælg Ansat</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.firstname} {employee.lastname}
                  </option>
                ))}
              </select>
              {errors.employeeId && <div className="text-xs text-red-600">Ansat er påkrævet</div>}
            </div>
            <div className='flex justify-between'>
              <label className='text-md' htmlFor="message">Besked:</label>
              <textarea
                className='w-full max-w-[480px] p-2 border-2'
                placeholder='Skriv din besked her'
                id="message"
                rows='4'
                {...register("message", { required: true })}
              />
              {errors.message && <div className="text-xs text-red-600">Besked er påkrævet</div>}
            </div>
            <div className='flex justify-end mt-4'>
              <button className='bg-lavender px-6 py-2 text-paynes-gray font-poppins  rounded-sm' type="submit">Send</button>
            </div>
          </form>
        )}
      </div>
      <div className='ml-6 flex-grow'>
        <iframe
          width="520"
          height="400"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          id="gmap_canvas"
          src="https://maps.google.com/maps?width=520&amp;height=400&amp;hl=en&amp;q=%C3%98ster%20Uttrup%20Vej%201%20Aalborg+()&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
        ></iframe>
        <script type='text/javascript' src='https://embedmaps.com/google-maps-authorization/script.js?id=6f651aa661714a2d84e4b9389d75a05672f9ccc2'></script>
      </div>
    </div>
  );
};
