# Local Outreach Hub - INTO SLU

A streamlined student outreach management application designed to optimize WhatsApp communication and Salesforce tracking for INTO Saint Louis University's Marketing & Recruitment team.

## 🎯 Problem Statement

Student recruitment teams face several challenges:
- **Context Switching**: Constantly switching between Salesforce and WhatsApp
- **Manual Data Entry**: Copy-pasting student information and logging activities
- **Lost Context**: Difficulty tracking previous interactions while composing follow-ups
- **Time-Consuming**: 15+ hours/week spent on repetitive outreach tasks

## ✨ Solution

Local Outreach Hub consolidates the entire outreach workflow into one intuitive interface:

1. **Upload Once**: Import Salesforce CSV reports
2. **See Everything**: View student list, details, and interaction history in one place
3. **Quick Templates**: Pre-written, customizable message templates
4. **Instant WhatsApp**: One-click to send via WhatsApp Web
5. **Auto-Logging**: Generate standardized Salesforce logs automatically

## 🚀 Features

### Core Workflow
- **CSV Upload & Parsing**: Handles Salesforce exports with tab or comma delimiters
- **Two-Panel Interface**: Student list (left) + active workspace (right)
- **Recent Activity Display**: Shows last interaction context immediately
- **Smart Search**: Filter students by name, country, or program
- **Status Indicators**: Visual badges for "New" vs "Contacted" leads

### Message Management
- **4 Pre-built Templates**:
  - Initial Welcome
  - Application Follow-up
  - Scholarship Information
  - Visa/I-20 Information
- **Dynamic Personalization**: Auto-fills {name}, {program}, {country}
- **Custom Editing**: Modify templates or write from scratch

### WhatsApp Integration
- Opens WhatsApp Web with pre-filled message
- Automatically formats phone numbers
- Works with international numbers

### Automated Logging
- Generates standardized log entries
- Includes timestamp and action description
- One-click copy to clipboard for Salesforce
- Example: `[Oct 6, 2023] Sent initial welcome message via WhatsApp regarding MS in Computer Science program. Student engaged, awaiting response.`

## 📊 Expected Impact

**Time Savings**: Reduces outreach workflow time by 50-60%
- Before: ~3-4 minutes per student (switching, copying, logging)
- After: ~1-2 minutes per student (all in one interface)

**Quality Improvement**: 
- Better context awareness leads to more relevant follow-ups
- Standardized logging improves team coordination
- Reduced errors from manual data entry

**Scale**: 
- Allows team to reach 2x more students in same time
- Better student experience with faster, more personalized responses

## 🛠️ Technical Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Architecture**: Client-side only (data stays local, privacy-first)
- **No Backend Required**: Fully functional without server/database

## 📋 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 📝 Using the Application

### Step 1: Prepare Your File

Export from Salesforce (CSV or Excel) with these fields:
- `FirstName`
- `LastName`
- `Email`
- `Phone`
- `Country`
- `Program_of_Interest__c`
- `Last_Interaction_Log__c` (for follow-ups)
- `Status` (New, Contacted, etc.)
- `LeadSource`

**Note**: Sample files (`sample-students.csv` and `sample-students.xlsx`) are included for testing.

### Step 2: Upload

1. Click "Upload" or **drag and drop** your file
2. Supports CSV, TSV, and Excel (XLSX/XLS) formats
3. Data loads instantly (stays local, never sent to server)

### Step 3: Select Student

1. Browse student list or use search
2. Click a student to view details
3. Recent activity displays automatically if available

### Step 4: Compose Message

1. Click a template (auto-personalizes)
2. Edit as needed
3. Preview in the text area

### Step 5: Send & Log

1. Click "Send via WhatsApp" → Opens WhatsApp Web
2. Send the message in WhatsApp
3. Return to Hub, click "Log Outreach"
4. Paste into Salesforce `Last_Interaction_Log__c` field

## 🎨 Design Philosophy

### User Experience
- **Minimal clicks**: Common actions require 1-2 clicks
- **Visual hierarchy**: Important info stands out
- **Responsive**: Works on laptop and larger screens
- **Clean aesthetics**: Professional look suitable for institutional use

### Privacy & Security
- **Local-first**: All data processing happens in browser
- **No cloud storage**: Data never leaves your machine
- **No API calls**: No external services (except WhatsApp Web link)
- **Session-based**: Data clears on page refresh

## 🔮 Future Enhancements

### Phase 2: AI Integration (Optional)
- **Context-Aware Generation**: AI suggests follow-ups based on last interaction
- **Privacy-First**: Only non-PII data (program, country, interaction summary) sent to AI
- **Human-in-Loop**: AI suggests, user reviews and edits
- **Smart Tone**: Adapts messaging based on student journey stage

### Phase 3: Advanced Features
- **Bulk Actions**: Send similar messages to multiple students
- **Analytics Dashboard**: Track outreach metrics and response rates
- **Template Management**: Create/edit custom templates
- **Multi-language Support**: Templates in different languages
- **Salesforce Integration**: Direct API connection (requires authentication)

## 💡 Demo Tips

1. **Show the problem first**: Describe the current manual workflow
2. **Load real data**: Use actual Salesforce export or sample CSV
3. **Walk through common scenarios**:
   - New lead (no previous activity)
   - Follow-up (with context from last interaction)
   - Different templates for different situations
4. **Highlight efficiency gains**: Time saved, better context, reduced errors
5. **Emphasize human element**: Tool enhances, doesn't replace personal touch

## 📧 Questions?

Built by a student worker candidate who understands:
- The pain points of high-volume outreach
- The importance of personalization at scale  
- How technology can amplify (not replace) human connection

---

**Version**: 1.0.0  
**Built for**: INTO Saint Louis University Marketing & Recruitment Team  
**Purpose**: Demo for student worker interview
