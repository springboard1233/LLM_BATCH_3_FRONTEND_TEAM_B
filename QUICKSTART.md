# Quick Start Guide

Get the Risk Analysis Platform running in 5 minutes.

## Step 1: Start the Application

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Step 2: Create Your Account

1. Click **"Register"** on the login page
2. Enter your details:
   - Full Name: Your name
   - Email: your.email@example.com
   - Password: (minimum 6 characters)
3. Click **"Create Account"**

You'll be automatically logged in and redirected to the dashboard.

## Step 3: Seed Sample Data

**IMPORTANT**: The database is empty initially. You need to seed it with sample data.

1. Look for the **"Seed Data"** button in the top navigation bar
2. Click it and confirm the action
3. Wait 10-15 seconds while 5,000+ transactions are generated
4. The page will automatically refresh

**What you get:**
- 5,019 transactions across 90 days
- 432 fraud cases (~8.6% fraud rate)
- 500 unique accounts
- 5 AI-driven recommendations
- Multiple transaction channels (Mobile, ATM, POS, Web)

## Step 4: Explore the Dashboard

### Risk Analysis Overview
View key metrics at the top:
- **Overall Risk Score**: Average risk across all transactions
- **Fraud Rate**: 8.6% (432 cases out of 5,019)
- **Fraud Cases**: 432 confirmed fraud transactions
- **High Value Fraud**: Fraud cases over ₹50,000

### Recommendations Panel
Review AI-generated recommendations:
- Click **"Acknowledge"** to mark as reviewed
- High, medium, and low severity recommendations
- Confidence scores for each recommendation

### Transaction Management

**Filter Transactions:**
- Status: Fraud, Legitimate, Pending
- Channel: Mobile, ATM, POS, Web
- Date range
- Amount range (₹)
- Risk score (0-100)

**View Transaction Details:**
1. Click the eye icon on any transaction
2. Review full details including device info
3. Submit feedback: Confirm Fraud / Legitimate / False Positive
4. Add notes for your analysis

**Export Data:**
- Click **"Export CSV"** to download current filtered view
- Use for reporting or external analysis

## Understanding Risk Scores

- **0-49** (Green): Low risk
- **50-79** (Yellow): Medium risk
- **80-100** (Red): High risk

## Pro Tips

1. **Start with Fraud Filter**: Set Status = "Fraud" to see confirmed fraud cases
2. **High Risk First**: Set Min Risk Score = 80 to see the highest risk transactions
3. **Recent Activity**: Use date filters to focus on recent transactions
4. **High Value Fraud**: Set Min Amount = 50000 and Status = "Fraud"

## Common Workflows

### Investigate Suspicious Activity
1. Filter by Status = "Pending" and Min Risk Score = 70
2. Review each transaction detail
3. Submit feedback to classify each transaction
4. Watch metrics update in real-time

### Review Recommendations
1. Scroll to Recommendations panel
2. Read through active recommendations
3. Click related transaction IDs to investigate
4. Acknowledge recommendations when reviewed

### Generate Reports
1. Apply relevant filters
2. Click "Export CSV"
3. Open in Excel/Google Sheets for analysis

## Troubleshooting

**Empty Dashboard?**
- Click the "Seed Data" button to generate sample transactions

**Can't See Seed Data Button?**
- Make sure you're logged in
- Look in the top-right area of the navigation bar

**Metrics Show Zero?**
- Refresh the page after seeding data
- Check browser console for any errors

## What's Next?

- Explore different filter combinations
- Practice classifying transactions
- Review all recommendations
- Export data for analysis

Enjoy exploring the Risk Analysis Platform!
