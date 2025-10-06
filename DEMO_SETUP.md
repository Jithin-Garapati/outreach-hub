# Local Outreach Hub - Setup Instructions

## Prerequisites
- Node.js 18+ installed
- Google Gemini API Key (free tier available)

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Key
1. Get your free Google Gemini API key from: https://aistudio.google.com/app/apikey
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Edit `.env.local` and add your API key:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_actual_api_key_here
   ```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

### 📤 File Upload
- Upload Salesforce CSV or Excel exports
- Drag & drop support
- Automatic field mapping

### 👥 Student Management
- Search and filter students
- View student details and interaction history
- Track outreach status

### 💬 Message Generation

#### Template Mode (Default)
- 5 pre-built message templates
- Dynamic variable replacement (name, country, program)
- Quick customization

#### AI Mode (Gemini-Powered)
- Context-aware message generation
- Considers previous interactions
- Personalized follow-ups
- Privacy-focused (no PII sent to AI)

### 📋 Salesforce Integration
- One-click WhatsApp message sending
- Automatic activity logging
- Copy-paste ready for Salesforce

## Project Structure

```
outreach-hub/
├── app/
│   ├── api/
│   │   └── generate-message/
│   │       └── route.ts          # Gemini AI API endpoint
│   ├── page.tsx                  # Main application page
│   └── layout.tsx
├── components/
│   ├── Header.tsx                # App header with reset
│   ├── UploadArea.tsx            # File upload interface
│   ├── StudentList.tsx           # Student sidebar
│   ├── StudentDetails.tsx        # Student info card
│   └── MessageWorkspace.tsx      # Message editor with AI
├── lib/
│   ├── types.ts                  # TypeScript interfaces
│   ├── constants.ts              # Message templates
│   └── utils.ts                  # File parsing & utilities
└── .env.local                    # API keys (not committed)
```

## Demo Tips

### For Your Interview
1. **Start with Template Mode** - Show the basic workflow first
2. **Toggle AI Mode** - Demonstrate the AI enhancement
3. **Show Context Awareness** - Select a student with previous interactions
4. **Highlight Privacy** - Explain that phone numbers/emails are never sent to AI
5. **Copy Log** - Show the Salesforce integration

### Key Talking Points
- "Reduces 15 hours of manual work to 8-10 hours"
- "AI-powered but privacy-conscious"
- "Works with existing Salesforce workflows"
- "Built in a weekend - imagine what's possible with more time"
- "Easy to extend with more features (scheduling, analytics, etc.)"

## Future Enhancements (Mention These!)
- 📊 Analytics dashboard (messages sent, response rates)
- ⏰ Follow-up reminders and scheduling
- 🌐 Multi-language support for international students
- 📱 Mobile app for on-the-go outreach
- 🤖 AI-powered response suggestions based on student replies
- 📈 Integration with Salesforce Marketing Cloud

## Troubleshooting

### AI Generation Not Working
- Check that `GOOGLE_GENERATIVE_AI_API_KEY` is set in `.env.local`
- Restart the development server after adding the key
- Check browser console for error messages

### File Upload Issues
- Ensure CSV/Excel has proper headers
- At least one of: FirstName, LastName, or Email must be present
- Check browser console for parsing errors

## License
MIT - Feel free to use this in your portfolio!
