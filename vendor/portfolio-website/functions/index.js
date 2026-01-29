const {onRequest} = require('firebase-functions/v2/https');
const {setGlobalOptions} = require('firebase-functions/v2');
const admin = require('firebase-admin');
const OpenAI = require('openai');
const compression = require('compression');

// Set global options for 2nd gen functions
setGlobalOptions({
  region: 'us-central1',
  maxInstances: 10,
  minInstances: 1, // Keep at least 1 instance warm to reduce cold starts
  memory: '256MiB',
  timeoutSeconds: 60
});

// Initialize Firebase Admin
admin.initializeApp();

// Initialize OpenAI client (lazy initialization to prevent timeout)
let openaiClient;
const getOpenAIClient = () => {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
};

// Health check function (2nd gen)
exports.healthCheckV2 = onRequest({
  cors: true,
  region: 'us-central1'
}, (req, res) => {
  // Apply compression for better performance
  compression()(req, res, () => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      message: 'Matome Portfolio API is running',
      version: '2.0',
      performance: {
        coldStart: false,
        minInstances: 1
      }
    });
  });
});

// AI chat function (2nd gen)
exports.chatWithAIV2 = onRequest({
  cors: true,
  region: 'us-central1'
}, async (req, res) => {
  // Apply compression for better performance
  compression()(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
    
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Invalid message' });
      return;
    }
    
    try {
      let response;
      
      // Use OpenAI if available, otherwise fallback to simple responses
      const client = getOpenAIClient();
      if (client) {
        const completion = await client.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are Matome's AI assistant. Help users learn about Matome's portfolio, skills, and projects. Be helpful and professional."
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        });
        
        response = completion.choices[0].message.content;
      } else {
        // Fallback responses when OpenAI is not available
        const responses = [
          "Hello! I'm Matome's AI assistant. How can I help you today?",
          "That's an interesting question! Let me think about that...",
          "I'd be happy to help you learn more about Matome's projects and skills!",
          "Great question! Matome has extensive experience in AI/ML and web development.",
          "I can tell you about Matome's technical expertise and project portfolio!"
        ];
        
        response = responses[Math.floor(Math.random() * responses.length)];
      }
      
      res.status(200).json({
        response: response,
        timestamp: new Date().toISOString(),
        status: 'success',
        version: '2.0',
        performance: {
          coldStart: false,
          minInstances: 1
        }
      });
      
    } catch (error) {
      console.error('Error in chatWithAIV2:', error);
      
      // Fallback response on error
      const fallbackResponses = [
        "I'm having trouble processing your request right now. Please try again later.",
        "Sorry, I encountered an error. Let me help you with something else!",
        "I'm experiencing some technical difficulties. How else can I assist you?"
      ];
      
      const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      res.status(200).json({
        response: fallbackResponse,
        timestamp: new Date().toISOString(),
        status: 'success',
        version: '2.0',
        note: 'Using fallback response due to error',
        performance: {
          coldStart: false,
          minInstances: 1
        }
      });
    }
  });
});