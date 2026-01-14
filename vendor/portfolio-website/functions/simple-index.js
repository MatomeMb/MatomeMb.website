const {onRequest} = require('firebase-functions/v2/https');
const {setGlobalOptions} = require('firebase-functions/v2');
const admin = require('firebase-admin');

// Set global options for 2nd gen functions
setGlobalOptions({
  region: 'us-central1',
  maxInstances: 10,
  memory: '256MiB',
  timeoutSeconds: 60
});

// Initialize Firebase Admin
admin.initializeApp();

// Simple health check function (2nd gen)
exports.healthCheckSimple = onRequest({
  cors: true,
  region: 'us-central1'
}, (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'Matome Portfolio API is running (Simple)',
    version: '2.0'
  });
});

// Simple AI chat function (2nd gen)
exports.chatWithAISimple = onRequest({
  cors: true,
  region: 'us-central1'
}, (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  const { message } = req.body;
  
  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Invalid message' });
    return;
  }
  
  // Simple response without OpenAI
  const responses = [
    "Hello! I'm Matome's AI assistant. How can I help you today?",
    "That's an interesting question! Let me think about that...",
    "I'd be happy to help you learn more about Matome's projects and skills!",
    "Great question! Matome has extensive experience in AI/ML and web development.",
    "I can tell you about Matome's technical expertise and project portfolio!"
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  res.status(200).json({
    response: randomResponse,
    timestamp: new Date().toISOString(),
    status: 'success',
    version: '2.0'
  });
});