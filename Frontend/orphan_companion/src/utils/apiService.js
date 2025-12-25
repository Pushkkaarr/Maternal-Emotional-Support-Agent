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
      'father': 'father',
      'sister': 'sister',
      'brother': 'brother'
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
