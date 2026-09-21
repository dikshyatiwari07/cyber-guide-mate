-- Topics
CREATE TABLE public.cyber_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  warning_signs TEXT[] NOT NULL DEFAULT '{}',
  safety_tips TEXT[] NOT NULL DEFAULT '{}',
  avoid_tips TEXT[] NOT NULL DEFAULT '{}',
  icon TEXT NOT NULL DEFAULT 'shield',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cyber_topics TO anon, authenticated;
GRANT ALL ON public.cyber_topics TO service_role;
ALTER TABLE public.cyber_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Topics are public" ON public.cyber_topics FOR SELECT TO anon, authenticated USING (true);

-- Quiz questions
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('a','b','c','d')),
  explanation TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.quiz_questions TO anon, authenticated;
GRANT ALL ON public.quiz_questions TO service_role;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions are public" ON public.quiz_questions FOR SELECT TO anon, authenticated USING (true);

-- Quiz attempts
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  score INT NOT NULL CHECK (score >= 0),
  total_questions INT NOT NULL CHECK (total_questions > 0),
  percentage NUMERIC(5,2) NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.quiz_attempts TO anon, authenticated;
GRANT ALL ON public.quiz_attempts TO service_role;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can record an attempt" ON public.quiz_attempts FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Attempt stats are public" ON public.quiz_attempts FOR SELECT TO anon, authenticated USING (true);

-- Message checks
CREATE TABLE public.message_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_text TEXT NOT NULL CHECK (char_length(message_text) BETWEEN 1 AND 2000),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low Risk','Be Careful','Potential Scam')),
  detected_signs TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.message_checks TO anon, authenticated;
GRANT ALL ON public.message_checks TO service_role;
ALTER TABLE public.message_checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log a check" ON public.message_checks FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Checks are public" ON public.message_checks FOR SELECT TO anon, authenticated USING (true);

-- Reports
CREATE TABLE public.cyber_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_type TEXT NOT NULL,
  description TEXT NOT NULL CHECK (char_length(description) BETWEEN 10 AND 2000),
  email TEXT,
  status TEXT NOT NULL DEFAULT 'Submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.cyber_reports TO anon, authenticated;
GRANT ALL ON public.cyber_reports TO service_role;
ALTER TABLE public.cyber_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a report" ON public.cyber_reports FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Reports readable for prototype dashboard" ON public.cyber_reports FOR SELECT TO anon, authenticated USING (true);

-- Feedback
CREATE TABLE public.community_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.community_feedback TO anon, authenticated;
GRANT ALL ON public.community_feedback TO service_role;
ALTER TABLE public.community_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit feedback" ON public.community_feedback FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Feedback is public" ON public.community_feedback FOR SELECT TO anon, authenticated USING (true);

-- Seed topics
INSERT INTO public.cyber_topics (title, description, warning_signs, safety_tips, avoid_tips, icon, sort_order) VALUES
('Phishing Scams', 'Fake messages or emails that pretend to be from a bank, delivery company or government office so you share your details on a fake website.',
 ARRAY['Urgent warnings like "account will be blocked today"','Links that look almost right but have extra letters','Spelling and grammar mistakes','Asks you to "verify" personal details'],
 ARRAY['Open the official app or type the website address yourself','Call the number printed on your bank card','Check with a family member before acting'],
 ARRAY['Do not click links inside unexpected messages','Do not enter your password on a page you reached from a message','Do not reply with personal details'],
 'mail', 1),
('OTP Fraud', 'Someone calls or messages you and asks for the one-time password (OTP) sent to your phone so they can complete a transaction from your account.',
 ARRAY['Caller says they need the OTP to "cancel" a transaction','OTP arrives when you did not request anything','Caller pressures you to read the code quickly'],
 ARRAY['Treat an OTP like cash - it is only for you','Hang up and call the official helpline','Check your account statement if an unexpected OTP arrives'],
 ARRAY['Never share an OTP with anyone, even bank staff','Do not forward OTP messages','Do not read the code aloud on a call'],
 'smartphone', 2),
('UPI / Payment Fraud', 'Scammers send a "collect request" or QR code and tell you it will add money to your account. Approving it actually sends your money to them.',
 ARRAY['You are asked to scan a QR code "to receive" money','A stranger sends a payment request for a refund','Seller insists on payment before any proof'],
 ARRAY['Remember: receiving money never needs your PIN','Check the name on the payment screen before confirming','Use small test amounts with new sellers'],
 ARRAY['Do not enter your UPI PIN to receive money','Do not scan QR codes sent by strangers','Do not approve unknown collect requests'],
 'credit-card', 3),
('Fake Customer Care Calls', 'A caller claims to be from customer care of a bank, wallet or online store and asks you to install an app or share details to fix a problem.',
 ARRAY['Number found through a web search or social media comment','Asks you to install a screen-sharing or remote app','Claims your refund is stuck and needs your help'],
 ARRAY['Find helpline numbers only in the official app or on your card','Hang up and call back yourself','Ask for the complaint number and verify it officially'],
 ARRAY['Do not install remote-access apps for a caller','Do not share card, PIN or OTP details','Do not let anyone guide you through your banking app'],
 'phone-call', 4),
('Social Media Scams', 'Fake profiles, lottery messages, job offers and cloned accounts of friends that ask for money, documents or account access.',
 ARRAY['A "friend" suddenly asks for urgent money','Job offers asking for a registration fee','Prize or lottery messages you never entered','Profiles created very recently with few friends'],
 ARRAY['Call the friend on their known number to confirm','Keep your profile private and review followers','Enable two-factor authentication on your accounts'],
 ARRAY['Do not send money based on a chat message alone','Do not share ID documents with unknown recruiters','Do not reuse the same password across accounts'],
 'users', 5),
('Malicious Links', 'Shortened or lookalike links that install harmful apps or open fake login pages when tapped.',
 ARRAY['Very short links in an unexpected message','Web address with odd spelling or extra words','Page asks to download an APK or unknown file','Offers that look too good to be true'],
 ARRAY['Check the full web address before opening','Type important website names yourself','Keep your phone and browser updated'],
 ARRAY['Do not tap links from unknown numbers','Do not install apps from outside official app stores','Do not grant permissions you do not understand'],
 'link', 6);

-- Seed quiz questions
INSERT INTO public.quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
('Someone from your bank calls and asks for the OTP on your phone. What should you do?','Share it, bank staff can be trusted','Never share it and end the call','Share only half of it','Send it by SMS instead','b','No genuine bank or company employee will ever ask for your OTP. An OTP is only for you to use.'),
('What is phishing?','A type of online game','A fake message that tricks you into sharing details','A way to speed up your internet','A mobile payment app','b','Phishing messages pretend to be from a trusted organisation so you reveal passwords or card details.'),
('You get an unknown link on WhatsApp saying you won a prize. What is the safest action?','Tap it to check','Forward it to friends','Delete it without tapping','Reply asking for details','c','Unexpected prize links usually lead to fake pages or harmful apps. Delete them.'),
('Which of these is the strongest password?','12345678','yourname123','A long phrase with numbers and symbols','password','c','Long, unique passwords or passphrases are much harder to guess or crack.'),
('What is two-factor authentication?','Two passwords for one account','A second check such as a code or fingerprint after your password','Logging in from two phones','Sharing your account with a second person','b','Two-factor authentication adds a second proof of identity, so a stolen password alone is not enough.'),
('A caller says your account will be blocked unless you verify details right now. This urgency is:','Normal bank behaviour','A common scam tactic','A sign the call is official','Required by law','b','Creating panic and urgency is one of the most common scam tactics. Slow down and verify officially.'),
('You accidentally clicked a suspicious link. What should you do first?','Ignore it completely','Disconnect the internet, change passwords and scan your device','Click it again to check','Share it with friends to warn them','b','Disconnecting, changing passwords and scanning limits the damage. Also watch your accounts for unusual activity.'),
('To receive money on a UPI app, you need to:','Enter your UPI PIN','Scan a QR code sent by the sender','Do nothing - money arrives on its own','Share your OTP','c','You never need a PIN or OTP to receive money. Anyone asking for that is trying to take money from you.'),
('How can you better protect a social media account?','Use the same password everywhere','Accept every friend request','Turn on two-factor authentication and review privacy settings','Share your login with a friend','c','Two-factor authentication plus tight privacy settings makes account takeover much harder.'),
('Before entering your password on a website, you should:','Check the full web address carefully','Only look at the logo','Trust it if the design looks professional','Trust it if a message sent you there','a','Fake sites copy logos and design. The web address is the most reliable clue.'),
('What should you do if money has already been lost to a scam?','Wait and see','Contact your bank immediately and report to cybercrime authorities','Keep chatting with the scammer','Delete all evidence','b','Fast reporting to your bank and to cybercrime authorities gives the best chance of stopping the transfer.'),
('Public Wi-Fi is safest used for:','Internet banking','Entering card details','General browsing without logging into sensitive accounts','Sharing documents','c','Open networks can be monitored. Avoid banking or sensitive logins on them.');