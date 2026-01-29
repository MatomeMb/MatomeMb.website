# Local Chatbot Documentation

## Overview

The portfolio includes a **local, knowledge-base grounded chatbot** that runs entirely in the browser with **no external API calls**. This ensures privacy and eliminates dependency on third-party services.

## How It Works

1. **Knowledge Base** (`chatbot/chatbot_knowledge.json`)
   - JSON file containing all chatbot responses
   - Structured by topic and keywords
   - Loaded once on page load

2. **Chatbot Widget** (`chatbot/chatbot.js`)
   - Listens for user messages
   - Matches against knowledge base
   - Returns contextual responses
   - No logging or analytics

3. **Styling** (`chatbot/chatbot.css`)
   - Dark theme matching portfolio
   - Responsive on mobile/desktop
   - Smooth animations

## Knowledge Base Structure

```json
{
  "topics": [
    {
      "id": "introduction",
      "keywords": ["hello", "hi", "introduction", "who are you"],
      "response": "Hi! I'm Matome's portfolio assistant..."
    },
    {
      "id": "skills",
      "keywords": ["skills", "technologies", "what can you do"],
      "response": "Matome specializes in..."
    }
  ]
}
```

## Maintenance

### Updating Responses
1. Edit `chatbot/chatbot_knowledge.json`
2. Add keywords and responses
3. Test in browser chatbot
4. Commit and push to GitHub

### Keywords Best Practices
- Use lowercase
- Include common variations (plural, abbreviated forms)
- Add 3-5 keywords per topic
- Keep responses concise (< 300 chars)

## Safety Guidelines

- **No sensitive data** in knowledge base (NDA-compliant)
- **No personal information** (SSN, addresses, etc.)
- **No external links** (unless necessary)
- **Refuses unsafe topics** (medical, legal, financial advice)

## Privacy

- **Messages are never stored**
- **No analytics or telemetry**
- **No external API calls**
- **All processing happens in-browser**

## Limitations

- Only responds to exact keyword matches (not AI-powered)
- Cannot learn or improve over time
- No context awareness between messages
- No access to real-time information
