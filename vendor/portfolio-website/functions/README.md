# Firebase Cloud Functions for Matome Portfolio

This directory contains Firebase Cloud Functions for the Matome Portfolio project.

## Functions

### 2nd Generation Functions (Recommended)

- **healthCheckV2**: Health check endpoint
- **chatWithAIV2**: AI chat endpoint with OpenAI integration
- **healthCheckSimple**: Simple health check (no external dependencies)
- **chatWithAISimple**: Simple AI chat (no external dependencies)

## Environment Variables

Set the following environment variables in your Firebase project:

```bash
# Optional: OpenAI API Key for enhanced AI responses
firebase functions:config:set openai.api_key="your_openai_api_key_here"

# Set discovery timeout to prevent deployment timeouts
export FUNCTIONS_DISCOVERY_TIMEOUT=30
```

Or set the timeout in your deployment command:
```bash
FUNCTIONS_DISCOVERY_TIMEOUT=30 firebase deploy --only functions
```

## Deployment

```bash
# Install dependencies
npm install

# Deploy functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:healthCheckV2
```

## Local Development

```bash
# Start Firebase emulator
npm run serve

# Test functions locally
curl http://localhost:5001/your-project-id/us-central1/healthCheckV2
```

## Performance Optimizations

- **Cold Start Mitigation**: `minInstances: 1` keeps at least 1 instance warm (reduces cold starts from 5-40s to <1s)
- **Compression**: All responses are compressed for faster transfers
- **Lazy Loading**: OpenAI client initializes only when needed
- **Error Handling**: Graceful fallbacks for all error scenarios

## Migration Notes

- Functions have been migrated from 1st generation to 2nd generation
- Function names have been updated to avoid conflicts (e.g., `healthCheck` → `healthCheckV2`)
- OpenAI integration is optional and will fallback to simple responses if not configured
- All initialization code uses lazy loading to prevent deployment timeouts
- Performance monitoring included in all responses
