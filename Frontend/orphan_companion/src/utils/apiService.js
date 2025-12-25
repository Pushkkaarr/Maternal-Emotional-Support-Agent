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

// Donations admin
export const fetchDonationsAdmin = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/db/admin/donations`, { withCredentials: true });
    return res.data.data || [];
  } catch (err) {
    console.error('fetchDonationsAdmin error', err);
    toast.error('Unable to load donations');
    return [];
  }
};

export const updateDonation = async (id, payload) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/api/db/donations/${id}`, payload, { withCredentials: true });
    return res.data.data;
  } catch (err) {
    console.error('updateDonation error', err);
    toast.error('Failed to update donation');
    throw err;
  }
};

// Children / Adoption / Sponsorship
export const fetchChildren = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/db/children`);
    return res.data.data || [];
  } catch (err) {
    console.error('fetchChildren error', err);
    toast.error('Unable to load children');
    return [];
  }
};

export const submitAdoptionApplication = async (applicationPayload) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/db/adoption_applications`, applicationPayload);
    return res.data;
  } catch (err) {
    console.error('submitAdoptionApplication error', err);
    toast.error('Failed to submit adoption application');
    throw err;
  }
};

export const createSponsorship = async (sponsorshipPayload) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/db/sponsorships`, sponsorshipPayload);
    return res.data;
  } catch (err) {
    console.error('createSponsorship error', err);
    toast.error('Failed to create sponsorship');
    throw err;
  }
};

// Inventory / Movements
export const fetchInventoryItems = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/db/inventory`, { withCredentials: true });
    return res.data.data || [];
  } catch (err) {
    console.error('fetchInventoryItems error', err);
    toast.error('Unable to load inventory items');
    return [];
  }
};

export const fetchMovements = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/db/inventory_movements`, { withCredentials: true });
    return res.data.data || [];
  } catch (err) {
    console.error('fetchMovements error', err);
    toast.error('Unable to load inventory movements');
    return [];
  }
};

export const createMovement = async (movementPayload) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/db/inventory_movements`, movementPayload, { withCredentials: true });
    return res.data.data;
  } catch (err) {
    console.error('createMovement error', err);
    toast.error('Failed to record movement');
    throw err;
  }
};

// Admin children management (requires auth cookie or Authorization header)
export const createChild = async (childPayload) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/db/children`, childPayload, { withCredentials: true });
    return res.data.data;
  } catch (err) {
    console.error('createChild error', err);
    toast.error('Failed to create child');
    throw err;
  }
};

export const updateChild = async (id, childPayload) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/api/db/children/${id}`, childPayload, { withCredentials: true });
    return res.data.data;
  } catch (err) {
    console.error('updateChild error', err);
    toast.error('Failed to update child');
    throw err;
  }
};

export const deleteChild = async (id) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/api/db/children/${id}`, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error('deleteChild error', err);
    toast.error('Failed to delete child');
    throw err;
  }
};

// Auth
export const authSignup = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, { email, password });
    return res.data;
  } catch (err) {
    console.error('authSignup error', err);
    throw err;
  }
};

export const authLogin = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
    return res.data;
  } catch (err) {
    console.error('authLogin error', err);
    throw err;
  }
};

export const authLogout = async () => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/logout`);
    return res.data;
  } catch (err) {
    console.error('authLogout error', err);
    throw err;
  }
};

export const fetchSession = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/auth/session`);
    return res.data;
  } catch (err) {
    console.error('fetchSession error', err);
    return { user: null };
  }
};
