import axios from 'axios';
import { toast } from "sonner";

// Define API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Send user message to the backend API
export const sendMessage = async (message, familyMember) => {
  try {
    console.log(`Sending message to ${familyMember}: ${message}`);
    
    // Map family member to backend endpoint
    const modelEndpoints = {
      'mother': 'mother',
    };
    
    // Get the correct endpoint or default to 'mother'
    const endpoint = modelEndpoints[familyMember] || 'mother';
    
    // Construct full API URL
    const apiUrl = `${API_BASE_URL}/api/model/${endpoint}`;
    
    // Make the API call
    const response = await axios.post(apiUrl, { message });
    
    // Return the response from the backend
    return response.data.response;
  } catch (error) {
    console.error('Error sending message:', error);
    
    // Show error toast
    toast.error('Failed to send message. Please try again.');
    
    // Throw the error to be handled by the caller
    throw error;
  }
};

// Donations / Wishlist API
export const fetchWishlist = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/db/wishlist`);
    return res.data.data || [];
  } catch (err) {
    console.error('fetchWishlist error', err);
    toast.error('Unable to load wishlist items');
    return [];
  }
};

export const createDonation = async (donationPayload) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/db/donations`, donationPayload);
    return res.data;
  } catch (err) {
    console.error('createDonation error', err);
    toast.error('Failed to submit donation');
    throw err;
  }
};

export const createPledge = async (pledgePayload) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/db/donation_pledges`, pledgePayload);
    return res.data;
  } catch (err) {
    console.error('createPledge error', err);
    toast.error('Failed to submit pledge');
    throw err;
  }
};
