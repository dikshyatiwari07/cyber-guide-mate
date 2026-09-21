# CyberSafe Community Hub

Build a complete full-stack web application called “CyberSafe Community”.

PROJECT PURPOSE:

This is a Community Connect project for B.Tech Information Technology students. The goal is to spread cybersecurity awareness and digital safety among local communities, especially people with limited technical knowledge.

The application should not be just a static frontend. Build a functional full-stack prototype with a frontend, backend logic, database, and interactive features.

TECH STACK:

- Frontend: React + TypeScript

- Styling: Tailwind CSS

- Backend/database: Supabase

- Database: PostgreSQL through Supabase

- Use Supabase APIs for database operations

- Use clean reusable components

- Make the application responsive for desktop, tablet and mobile.

IMPORTANT:

Do not use fake buttons that do nothing.

All major interactive features should work.

Do not require login for the basic awareness features.

Use demo/sample data where real external services are not required.

==================================================

1. APPLICATION NAME AND BRANDING

==================================================

Name:

CyberSafe Community

Tagline:

“Stay Safe. Stay Smart. Stay Secure.”

Purpose:

“Simple cybersecurity awareness for everyone.”

Design:

- Professional cybersecurity/education theme

- Primary color: blue

- Background: white and very light gray

- Warning color: red

- Success color: green

- Use shield, lock, warning, smartphone and security icons

- Rounded cards

- Modern navigation

- Subtle animations

- Clean typography

- Accessible design

- Avoid an overly technical hacker-style design

==================================================

2. NAVIGATION

==================================================

Create a responsive navbar with:

Home

Learn

Check Message

Safety Tips

Quiz

Help

Include a “Get Protected” button that takes the user to the Safety Tips section.

On mobile, use a hamburger menu.

==================================================

3. HOME PAGE

==================================================

Create a professional hero section.

Heading:

“Stay Safe. Stay Smart. Stay Secure.”

Subtitle:

“Learn simple cybersecurity practices and protect yourself from common online scams.”

Buttons:

- Learn Cyber Safety

- Check a Suspicious Message

Add a cybersecurity shield illustration.

Below the hero, show three feature cards:

1. Learn

Learn about common cyber threats.

2. Check

Check suspicious messages using our awareness-based detection tool.

3. Protect

Follow simple digital safety practices.

Add a statistics section with demo values such as:

“500+ People Reached”

“6+ Cyber Threats Explained”

“100+ Quiz Attempts”

Clearly treat these as prototype/demo statistics and make them easy to replace with real database counts.

Add a short “Why Cybersecurity Matters” section.

==================================================

4. LEARN CYBER SAFETY

==================================================

Create a page containing cybersecurity awareness cards.

Topics:

1. Phishing Scams

2. OTP Fraud

3. UPI/Payment Fraud

4. Fake Customer Care Calls

5. Social Media Scams

6. Malicious Links

Each topic should contain:

- Short explanation

- Warning signs

- What to do

- What NOT to do

Allow the user to click a card to view more details.

Store these awareness topics in the Supabase database instead of hardcoding everything in the frontend.

Create a database table:

cyber_topics

Fields:

- id

- title

- description

- warning_signs

- safety_tips

- icon

- created_at

Seed the database with the six topics above.

==================================================

5. CHECK SUSPICIOUS MESSAGE

==================================================

Create an interactive tool called:

“Check a Suspicious Message”

The user can paste an SMS, WhatsApp message, email or other suspicious text into a textarea.

Example:

“Your bank KYC has expired. Click this link immediately to verify your account.”

Add a button:

“Check Message”

The frontend should send the message to a backend/API function.

Create backend logic for basic rule-based awareness detection.

Check for suspicious indicators such as:

- OTP

- urgent

- immediately

- click

- verify now

- KYC

- bank account

- prize

- winner

- reward

- payment

- account blocked

- password

- suspicious URLs

- shortened URLs

Do NOT claim this is a real cybersecurity threat-detection engine.

The result should contain:

Risk level:

- Low Risk

- Be Careful

- Potential Scam

Also display detected warning signs.

Example:

Potential Scam

Warning signs detected:

• Urgent language

• KYC request

• Suspicious link

Advice:

“Do not click the link or share OTP, PIN or password. Verify the request through the organization's official website or app.”

Create a database table:

message_checks

Fields:

- id

- message_text

- risk_level

- detected_signs

- created_at

Save each check to Supabase.

IMPORTANT PRIVACY:

Do not collect names, phone numbers, bank details, OTPs or other sensitive personal information.

Show a warning telling users not to paste confidential information into the tool.

==================================================

6. COMMUNITY QUIZ

==================================================

Create an interactive cybersecurity awareness quiz.

Create a database table:

quiz_questions

Fields:

- id

- question

- option_a

- option_b

- option_c

- option_d

- correct_answer

- explanation

Add at least 10 questions.

Example topics:

- Should you share your OTP?

- What is phishing?

- What should you do with an unknown link?

- What makes a password strong?

- What is two-factor authentication?

- How should you respond to a fake bank call?

- What should you do if you accidentally click a suspicious link?

- How can social media accounts be protected?

Show 5 questions randomly for each quiz attempt.

Features:

- One question at a time

- Progress indicator

- Next button

- Previous button if possible

- Submit Quiz

- Score calculation

- Correct/incorrect answer feedback

- Explanation after each answer

At the end show:

“Your Score: X/5”

Give a simple message based on score.

Save quiz attempts in:

quiz_attempts

Fields:

- id

- score

- total_questions

- percentage

- completed_at

Do not require login for quiz participation.

==================================================

7. SAFETY TIPS

==================================================

Create a visually attractive safety tips page.

Include:

- Never share OTP or PIN

- Use strong and unique passwords

- Enable two-factor authentication

- Avoid unknown links

- Verify payment requests

- Keep software updated

- Avoid sharing sensitive information

- Check website URLs before entering credentials

- Use official apps and websites

- Report suspicious activity

Add a “Quick Safety Checklist” where users can tick completed safety practices.

==================================================

8. HELP / REPORT PAGE

==================================================

Create a “Need Help?” page.

Explain what someone should do if they suspect online fraud:

1. Stop communicating with the suspected scammer.

2. Do not share additional information.

3. Contact your bank/payment provider immediately if money is involved.

4. Save screenshots and transaction information.

5. Report the incident to the appropriate cybercrime authority.

Create a simple report form with:

- Type of issue

- Description

- Optional email

- Submit Report button

IMPORTANT:

Do not ask users for:

- OTP

- PIN

- Password

- Bank account number

- Card number

- CVV

Store reports in:

cyber_reports

Fields:

- id

- issue_type

- description

- email

- status

- created_at

Default status:

“Submitted”

After submission show:

“Your report has been submitted successfully.”

This is only a prototype reporting system and does not automatically submit reports to government authorities.

==================================================

9. COMMUNITY FEEDBACK

==================================================

Add a small feedback section.

Fields:

- Rating from 1–5

- Feedback message

Store feedback in:

community_feedback

Fields:

- id

- rating

- feedback

- created_at

Show a thank-you message after submission.

==================================================

10. DASHBOARD / ADMIN VIEW

==================================================

Create a simple protected-looking prototype dashboard at:

/admin

This dashboard should display database information such as:

- Total message checks

- Total quiz attempts

- Average quiz score

- Total reports

- Total feedback submissions

Show recent:

- Message checks

- Quiz attempts

- Reports

- Feedback

For this academic prototype, do not build complex role management unless necessary.

If authentication is easy to implement with Supabase, create a simple admin login.

==================================================

11. DATABASE

==================================================

Create the required Supabase PostgreSQL tables:

cyber_topics

quiz_questions

quiz_attempts

message_checks

cyber_reports

community_feedback

Add appropriate:

- Primary keys

- Timestamps

- Basic validation

- Row Level Security where appropriate

Public users should be able to:

- Read cybersecurity topics

- Read quiz questions

- Submit quiz attempts

- Check messages

- Submit reports

- Submit feedback

Do not expose sensitive administrative operations to public users.

==================================================

12. BACKEND/API LOGIC

==================================================

Create backend/API functionality for:

1. Message checking

2. Saving message checks

3. Fetching cybersecurity topics

4. Fetching quiz questions

5. Saving quiz attempts

6. Submitting reports

7. Submitting feedback

8. Dashboard statistics

Use proper error handling.

Show user-friendly error messages.

Never expose database credentials or secret keys in frontend code.

Use environment variables for sensitive configuration.

==================================================

13. USER EXPERIENCE

==================================================

The application should feel like a real community awareness platform.

Add:

- Loading states

- Empty states

- Success notifications

- Error notifications

- Form validation

- Responsive design

- Smooth scrolling

- Accessible buttons

- Clear navigation

Do not overcomplicate the UI.

The target audience is ordinary community members, not cybersecurity professionals.

==================================================

14. DISCLAIMER

==================================================

Add a small disclaimer:

“This website is an educational cybersecurity awareness prototype. The message checker uses basic rule-based indicators and should not be considered a professional cybersecurity detection system. Never share OTPs, passwords, PINs, banking credentials or other confidential information.”

==================================================

15. FINAL REQUIREMENTS

==================================================

Make sure the project is fully connected:

Frontend

↓

Backend/API logic

↓

Supabase

↓

Database

↓

Response to frontend

Test all major buttons and forms.

Do not leave placeholder buttons.

Use realistic sample data.

Make the application presentation-ready for a college Community Connect project.

The final prototype should clearly demonstrate:

COMMUNITY PROBLEM

↓

CYBERSECURITY AWARENESS

↓

DIGITAL SOLUTION

↓

USER INTERACTION

↓

DATA COLLECTION

↓

COMMUNITY IMPACT

Build the complete working prototype now.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://cyber-guide-mate.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/41c678b9-d44d-53ec-9208-9db72736cb6d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
