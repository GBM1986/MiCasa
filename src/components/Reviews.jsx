import React, { useState, useEffect } from 'react';
import { useSupabase } from '../providers/SupabaseProvider';
import { useForm } from 'react-hook-form';

export const Reviews = () => {
    const { supabase } = useSupabase();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0); // Track the current review index

    const {
        register: registerNewReview,
        handleSubmit: handleSubmitNewReview,
        reset: resetNewReview
    } = useForm({
        defaultValues: {
            title: '',
            content: ''
        }
    });

    // Fetch reviews and user data
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
    }, [supabase]);

    // Auto-slide reviews every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
        }, 5000); // Change review every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [reviews]);

    // Add a new review
    const onAddReview = async (formData) => {
        if (!supabase || !user) {
            console.error('Supabase client is not initialized or user is not authenticated');
            return;
        }

        const { data, error } = await supabase
            .from('reviews')
            .insert([
                { 
                    title: formData.title,
                    content: formData.content,
                    num_stars: formData.num_stars,
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
            <h3 className="text-heading-1 font-poppins font-semibold flex justify-center  mb-6 mt-20">Det siger vores kunder</h3>
            <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="w-full bg-rose-quartz text-[#D5D5D5] py-2 mt-4 flex justify-center items-center"
            >
             {showReviewForm ? ' Skjul anmeldelsesformular ' : 'Skriv en anmeldelse'}
            </button>

            {showReviewForm && user && (
                <div className=" bg-paynes-gray p-4 border border-gray-300 bg-lightGreen">
                    
                    <form onSubmit={handleSubmitNewReview(onAddReview)} className="space-y-4 w-[600px] mx-auto">
                        
                        <label htmlFor="">Titel</label>
                        <input
                            {...registerNewReview('title')}
                            placeholder="Title"
                            className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <label htmlFor="">Indhold</label>
                        <textarea
                            {...registerNewReview('content')}
                            placeholder="Content"
                            className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <button 
                            type="submit"
                            className="bg-lavender text-paynes-gray hover:bg-thistle px-4 py-2 rounded-md hover:bg-deepGreen"
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}

            {reviews.length > 0 ? (
                <div className="p-4 mb-4 bg-lavender flex flex-col items-center py-12">
                    <p><strong>{reviews[currentIndex].title}</strong> </p>
                    <p>{reviews[currentIndex].content}</p>
                    <p>{new Date(reviews[currentIndex].created_at).toLocaleDateString()}</p>
                </div>
            ) : (
                <p className="text-center text-xl">No reviews available.</p>
            )}
        </div>
    );
};
