

// File: controllers/contentController.js
const axios = require('axios');

exports.generateResponse = async (req, res) => {
  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_MOTHER_API_KEY;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Construct the request payload according to the Gemini API format
    const payload = {
      contents: [
        {
          parts: [
            {
              text: message
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192
      }
    };
    
    // Make direct API call to Gemini
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/tunedModels/lovingmother-iguto0ifxl94:generateContent?key=${apiKey}`,
      payload
    );
    
    // Extract the generated text from the response
    const generatedText = response.data.candidates[0].content.parts[0].text;
    
    // Return the response
    res.status(200).json({
      response: generatedText
    });
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to generate response', 
      details: error.response?.data || error.message 
    });
  }
};