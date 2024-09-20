import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSupabase } from '../providers/SupabaseProvider';

export const Search = () => {
  const { supabase } = useSupabase();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        if (!supabase) {
          console.error('Supabase client is not initialized');
          return;
        }

        // Query both estates and cities
        const { data: estatesData, error: estatesError } = await supabase
          .from('estates')
          .select('*')
          .ilike('address', `%${query}%`)

        const { data: citiesData, error: citiesError } = await supabase
          .from('cities')
          .select('*')
          .ilike('name', `%${query}%`);

        if (estatesError || citiesError) {
          console.error('Error fetching search results:', estatesError || citiesError);
        } else {
          // Merge and deduplicate results if needed
          const results = [
            ...estatesData,
            ...citiesData
          ];

          // You may want to filter out duplicates or refine results further
          setSearchResults(results);
        }
      } catch (error) {
        console.error('Error in search:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, supabase]);

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Search Results for: {query}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p className="mb-4">Found {searchResults.length} results</p>
          <ul>
            {searchResults.map(result => (
              <li key={result.id} className="border-b border-gray-300 py-4">
                <h2 className="text-xl font-semibold">{result.address || result.name}</h2>
                <p>{result.description}</p>
                {/* You might want to link to the detailed page or provide more details */}
                <Link to={`/boliger/${result.id}`} className="text-blue-500">View Details</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Search;
