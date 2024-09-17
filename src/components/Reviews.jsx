import React, { useState, useEffect } from 'react';
import { useSupabase } from '../providers/SupabaseProvider';
import { useForm } from 'react-hook-form';

export const Reviews = ({ stationId, bannerArticle }) => {
    const { supabase } = useSupabase();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const {
        register: registerNewReview,
        handleSubmit: handleSubmitNewReview,
        reset: resetNewReview
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            comment: ''
        }
    });

    useEffect(() => {
        const fetchReviews = async () => {
            if (!supabase) {
                console.error('Supabase client is not initialized');
                return;
            }

            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('is_active', true);

            if (error) {
                console.error('Error fetching reviews:', error);
            } else {
                setReviews(data);
            }

            setLoading(false);
        };

        const fetchUser = async () => {
            if (!supabase) {
                console.error('Supabase client is not initialized');
                return;
            }

            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) {
                console.error('Error fetching user:', error);
            } else {
                setUser(user);
            }
        };

        fetchReviews();
        fetchUser();
    }, [supabase, stationId]);

    const onAddReview = async (formData) => {
        if (!supabase || !user) {
            console.error('Supabase client is not initialized or user is not authenticated');
            return;
        }

        const { data, error } = await supabase
            .from('reviews')
            .insert([
                { 
                    name: formData.name,
                    email: formData.email,
                    comment: formData.c,
                    user_id: user.id,
                    is_active: true
                }
            ]);

        if (error) {
            console.error('Error adding review:', error);
        } else {
            setReviews([...reviews, ...data]);
            resetNewReview();
            setShowReviewForm(false); // Hide the form after submission
        }
    };

    if (loading) return <p className="text-center text-xl font-semibold">Loading reviews...</p>;

    return (
        <div>
           
            <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="w-full bg-black text-white py-2 mt-4 flex justify-center items-center"
            >
                {showReviewForm ? 'Hide Review Form' : 'Add a Review'}
            </button>

            {showReviewForm && user && (
                <div className="mt-4 p-4 border border-gray-300 rounded-md bg-lightGreen">
                    <h3 className="text-heading-3 font-semibold mb-2">Add a Review</h3>
                    <form onSubmit={handleSubmitNewReview(onAddReview)} className="space-y-4">
                        <input
                            {...registerNewReview('name')}
                            placeholder="Name"
                            className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                            type="email"
                            {...registerNewReview('email')}
                            placeholder="Email"
                            className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <textarea
                            {...registerNewReview('comment')}
                            placeholder="Comment"
                            className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <button 
                            type="submit"
                            className="bg-forrestGreen text-black px-4 py-2 rounded-md hover:bg-deepGreen"
                        >
                            Add Review
                        </button>
                    </form>
                </div>
            )}

            {reviews.length > 0 ? (
                reviews.map(review => (
                    <div key={review.id} className="p-4 mb-4 bg-white border border-gray-200 rounded-md shadow-sm">
                        <p><strong>Name:</strong> {review.name}</p>
                        <p><strong>Email:</strong> {review.email}</p>
                        <p><strong>Comment:</strong> {review.comment}</p>
                        <p><strong>Date:</strong> {new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                ))
            ) : (
                <p className="text-center text-xl">No reviews available.</p>
            )}
        </div>
    );
};

export default Reviews;