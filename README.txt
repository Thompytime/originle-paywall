ORIGINLE PAYWALL PROJECT

1) Upload all files to your Vercel project.
2) In Stripe, create a one-time £0.99 Price and copy the price ID.
3) In Vercel > Project Settings > Environment Variables add:
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PRICE_ID=price_...
   COOKIE_SECRET=use-a-long-random-string
4) Redeploy.
5) In Vercel Domains, make sure originle.com is the Primary domain.
6) Test first with Stripe test keys, then switch to live keys.

FILES
- index.html: landing page with checkout button
- play.html: paid quiz game
- success.html: post-payment verification page
- quizzes.json: your uploaded 100-quiz archive
- api/create-checkout.js: creates Stripe Checkout Session
- api/confirm-session.js: verifies payment and sets cookie
- api/session.js: checks unlock state
- api/logout.js: clears unlock on the current browser
- package.json: installs Stripe
- vercel.json: clean URLs so /play works instead of /play.html
