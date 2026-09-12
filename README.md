# Glow & Ease — Wellness Gadget Store

A fully coded storefront (not Shopify/Wix) built around one coherent niche:
at-home wellness gadgets — red light therapy mask, posture corrector, mini
massage gun, weighted eye mask. Real cart, real checkout via Stripe, zero
monthly platform fees.

Everything below is free. Total time to go live: roughly 20–30 minutes.

---

## What's already done for you
- Full storefront (homepage, 4 product pages, cart, checkout flow)
- Design, copy, and placeholder product images
- A serverless function that securely creates Stripe Checkout sessions
  (so no card details ever touch this code)
- Netlify config so it deploys correctly out of the box

## What you still need to do (I can't do these — they require your identity/bank/email)

### Step 1 — Create a free Stripe account (~10 min)
1. Go to https://dashboard.stripe.com/register and sign up.
2. You can start in **test mode** immediately — no bank details needed yet.
   Add your bank account later, whenever you're ready to accept real money.
3. Once logged in, go to **Developers → API keys**.
4. Copy the **Secret key** (starts with `sk_test_...` or `sk_live_...`).
   Keep this private — never paste it into a public place.

### Step 2 — Put the code on GitHub (~5 min)
1. Create a free account at https://github.com if you don't have one.
2. Create a new repository (e.g. `glow-and-ease-store`).
3. Upload every file in this project folder to that repository
   (GitHub's website has an "upload files" button — drag the whole folder in).

### Step 3 — Deploy on Netlify for free (~5 min)
1. Create a free account at https://app.netlify.com using your GitHub login.
2. Click **Add new site → Import an existing project → GitHub**, and pick
   the repository you just created.
3. Leave build settings as-is (there's no build step, it's static + one function)
   and click **Deploy**.
4. Once deployed, go to **Site configuration → Environment variables** and add:
   - Key: `STRIPE_SECRET_KEY`
   - Value: the secret key you copied from Stripe in Step 1
5. Go to **Deploys** and click **Trigger deploy → Deploy site** once more so
   the new environment variable takes effect.

That's it — your site is now live at a free `yourname.netlify.app` address,
with real checkout wired up. Test it with Stripe's test card `4242 4242 4242 4242`,
any future expiry date, and any 3-digit CVC.

When you're ready to take real payments, go back to your Stripe dashboard and
"Activate your account" (adds your business + bank info), then switch
your Netlify environment variable to your **live** secret key (`sk_live_...`).

---

## Connecting a dropshipping supplier

This site doesn't auto-order from a supplier yet — that's a good next step
once you're getting sales. For now, the flow is:
1. A customer buys → you get an email receipt from Stripe (and can see it
   in your Stripe Dashboard → Payments).
2. You place the matching order yourself on a free supplier account —
   **CJ Dropshipping** or **Zendrop** both work well for this niche and are
   free to join — shipping directly to your customer's address.

Ask me anytime to build automatic order-forwarding once you're ready; it's a
reasonable next upgrade but not needed to start selling.

## Changing products or prices later
Edit `js/products.js` (what customers see) **and**
`netlify/functions/create-checkout-session.js` (the server-side price list —
this is the one that actually gets charged, so it must always match).

## Files in this project
```
index.html              → homepage / shop
product.html             → single product page (?id=red-light-mask etc.)
success.html / cancel.html → post-checkout pages
css/style.css             → all styling
js/products.js            → your product catalog (edit here to change products)
js/cart.js                → cart logic (localStorage-based, no backend needed)
netlify/functions/        → the one serverless function, talks to Stripe
netlify.toml               → tells Netlify how to deploy this
package.json                → declares the "stripe" library the function needs
```
