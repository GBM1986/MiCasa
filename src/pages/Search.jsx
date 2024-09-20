import React, { useEffect, useState } from 'react'; 
import { Link, useLocation } from 'react-router-dom'; 
import { useSupabase } from '../providers/SupabaseProvider'; 

export const Search = () => {
  const { supabase } = useSupabase(); 
  // Destructuring Supabase client from our provider, which allows us to interact with our database

  const location = useLocation(); 
  // The `useLocation` hook gives us access to the current URL, which includes query parameters like `?query=...`

  const query = new URLSearchParams(location.search).get('query'); 
  //  are using URLSearchParams to extract the search query from the URL (e.g., 'query=New York')

  const [searchResults, setSearchResults] = useState([]); 
  // `searchResults` stores the results returned from the database based on the search query
  // `setSearchResults` is the function to update the `searchResults` state

  const [loading, setLoading] = useState(true); 
  // `loading` state to manage the loading spinner or message while fetching the results from the database

  // useEffect will run when the component is mounted or when `query` or `supabase` changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true); 
      // Set loading to true before we start fetching the search results

      try {
        if (!supabase) {
          console.error('Supabase client is not initialized');
          return;
        }

        // Querying the `estates` table in Supabase, searching for any rows where the `address` column contains the search query
        const { data: estatesData, error: estatesError } = await supabase
          .from('estates') // Specify the `estates` table
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
          .ilike('address', `%${query}%`); // Use ILIKE to perform a case-insensitive search in the `address` column based on the `query`

        // Querying the `cities` table similarly to search for matches in the `name` column
        const { data: citiesData, error: citiesError } = await supabase
          .from('cities') // Specify the `cities` table
          .select('*') // Selecting all columns
          .ilike('name', `%${query}%`); // Case-insensitive search in `name` column

        // Error handling for either the estates or cities query
        if (estatesError || citiesError) {
          console.error('Error fetching search results:', estatesError || citiesError);
        } else {
          // Combine results from `estates` and `cities` into a single array of search results
          const results = [
            ...estatesData, // Spread the results from estates
            ...citiesData   // Spread the results from cities
          ];

          // Update the searchResults state with the fetched data
          setSearchResults(results);
        }
      } catch (error) {
      
        console.error('Error in search:', error);
      } finally {
       
        setLoading(false);
      }
    };

    fetchSearchResults(); 
    // Fetch search results when the component is mounted or the `query` changes
  }, [query, supabase]); 


  const formatPrice = (price) => {
    if (price == null) {  // Check if the price is undefined or null
      return 'N/A'; // Return 'N/A' if price is not available
    }
  
    return price.toLocaleString('da-DK', {
      style: 'currency',
      currency: 'DKK'
    });
  };

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6">
      {/* Display the search query in the title */}
      <h1 className="text-2xl font-bold mb-4">Search Results for: {query}</h1>
      
      {/* Conditional rendering: Show loading state or the results */}
      {loading ? (
        // If `loading` is true, show a loading message
        <p>Loading...</p>
      ) : (
        <>
          {/* Show how many results were found */}
          <p className="mb-4">Found {searchResults.length} results</p>

          {/* Map through `searchResults` and render each result */}
          <ul className='w-[1200px] mx-auto items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 py-8 justify-center gap-8 mt-60'>
            {searchResults.map((result, index) => (
                <Link key={result.id} className='z-20' to={`/boliger/${result.id}`}>
                <div className='max-w-sm bg-white rounded-lg shadow-md overflow-hidden'>
                    {/* Image Section */}
                    {result.estate_image_rel && result.estate_image_rel.length > 0 && (
                    <img
                        src={result.estate_image_rel[0]?.image_id?.image_url}
                        alt={result.address || 'No address available'}
                        className='w-full h-48 object-cover p-2'
                    />
                    )}

                    {/* Card Details */}
                    <div className='p-4'>
                    <div className='flex justify-between items-center'>
                        <h2 className="text-xl font-semibold mb-2">{result.address || result.name || 'No Address Available'}</h2>
                        <div className='w-[26px] h-[26px] text-center' style={{ backgroundColor: `#${result.energy_labels?.color || 'ccc'}` }}>
                        {result.energy_labels?.letter || 'N/A'}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">{result.cities?.zipcode} {result.cities?.name}</p>
                    <p className="text-sm text-gray-600">{result.estate_types?.name || 'Unknown type'}</p>
                    <p className="text-gray-700">{result.num_rooms} værelser, {result.floor_space}m²</p>
                    <div className="text-right mt-4">
                        <span className="text-lg font-semibold">{formatPrice(result.price)} DKK</span>
                    </div>
                    </div>
                </div>
                </Link>
            ))}
            </ul>
        </>
      )}
    </div>
  );
};

export default Search;
