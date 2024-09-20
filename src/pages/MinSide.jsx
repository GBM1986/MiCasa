import React, { useState, useEffect } from 'react';
import { useSupabase } from '../providers/SupabaseProvider';
import { useAuth } from '../providers/AuthProvider';

export const MinSide = () => {
  const { supabase } = useSupabase();
  const { loginData } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [editReviewId, setEditReviewId] = useState(null);
  const [newReviewText, setNewReviewText] = useState('');

  useEffect(() => {
    if (supabase && loginData?.user) {
      fetchUserReviews();
    }
  }, [supabase, loginData]);

  const fetchUserReviews = async () => {
    try {
      const { user } = loginData;
      if (user) {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching reviews:', error);
          setError('Error fetching reviews.');
        } else {
          setReviews(data);
        }
      }
    } catch (err) {
      console.error('An unexpected error occurred:', err.message);
      setError('An unexpected error occurred.');
    }
  };

  const handleEdit = async () => {
    if (editReviewId) {
      try {
        const { error } = await supabase
          .from('reviews')
          .update({ content: newReviewText }) // Assuming `content` is the field for review text
          .eq('id', editReviewId);

        if (error) {
          console.error('Error updating review:', error);
          setError('Error updating review.');
        } else {
          setReviews(reviews.map(review =>
            review.id === editReviewId ? { ...review, content: newReviewText } : review
          ));
          setEditReviewId(null);
          setNewReviewText('');
        }
      } catch (err) {
        console.error('An unexpected error occurred:', err.message);
        setError('An unexpected error occurred.');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting review:', error);
        setError('Error deleting review.');
      } else {
        setReviews(reviews.filter(review => review.id !== id));
      }
    } catch (err) {
      console.error('An unexpected error occurred:', err.message);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <h1 className='font-bold text-2xl mb-4'>Min side</h1>
      <h2 className='font-bold text-xl mb-4'>Mine anmeldelser</h2>

      <table className="table-auto w-full text-left">
        <thead>
          <tr className=" text-paynes-gray border-b uppercase text-sm leading-normal">
            <th className="py-3 px-6">Title</th>
            <th className="py-3 px-6">Date</th>
            <th className="py-3 px-6">Handling</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light ">
          {reviews.map((review) => (
            <tr key={review.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6">{review.content}</td>
              <td className="py-3 px-6">{new Date(review.created_at).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
              <td className="py-3 px-6 flex gap-4">
                <button
                  className="text-green-500 hover:text-green-700"
                  onClick={() => {
                    setEditReviewId(review.id);
                    setNewReviewText(review.content);
                  }}
                >
                  Rediger
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(review.id)}
                >
                  Slet
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editReviewId && (
        <div className="edit-form mt-4">
          <h2 className="font-bold text-xl mb-4">Rediger anmeldelse</h2>
          <textarea
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
            className="border p-2 w-full"
            rows="4"
          />
          <div className="mt-2 flex gap-2">
            <button
              className="save-button bg-lavender text-paynes-gray rounded-md px-4 py-2 hover:bg-thistle"
              onClick={handleEdit}
            >
              Save
            </button>
            <button
              className="cancel-button bg-lavender text-paynes-gray rounded-md px-4 py-2 hover:bg-thistle"
              onClick={() => setEditReviewId(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
