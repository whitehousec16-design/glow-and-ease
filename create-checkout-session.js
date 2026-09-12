// ============================================================
// This runs on Netlify's free serverless functions (not on your
// computer, not costing anything extra). It talks to Stripe using
// your SECRET key, which is stored safely as an environment
// variable on Netlify — never in this file, never in the browser.
// ============================================================

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Server-side copy of the catalog. This MUST match js/products.js.
// Keeping prices here (not trusting the browser) stops anyone from
// tampering with prices in their browser before checkout.
const PRODUCTS = {
  "red-light-mask": { name: "Lumen Glow Red Light Therapy Mask", price: 5900, image: "red-light-mask.svg" },
  "posture-corrector": { name: "Upright Ease Posture Corrector", price: 2900, image: "posture-corrector.svg" },
  "mini-massage-gun": { name: "Pocket Ease Mini Massage Gun", price: 3900, image: "mini-massage-gun.svg" },
  "weighted-eye-mask": { name: "Calm Layer Weighted Eye Mask", price: 2400, image: "weighted-eye-mask.svg" }
};

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { cart } = JSON.parse(event.body);

    if (!Array.isArray(cart) || cart.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "Cart is empty" }) };
    }

    const siteUrl = process.env.URL || `https://${event.headers.host}`;

    const line_items = cart
      .filter(line => PRODUCTS[line.id] && line.qty > 0)
      .map(line => {
        const p = PRODUCTS[line.id];
        return {
          quantity: line.qty,
          price_data: {
            currency: "usd",
            unit_amount: p.price,
            product_data: {
              name: p.name,
              images: [`${siteUrl}/images/${p.image}`]
            }
          }
        };
      });

    if (line_items.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "No valid items in cart" }) };
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "AU"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "usd" },
            display_name: "Standard Shipping (7-14 days)",
          }
        }
      ],
      success_url: `${siteUrl}/success.html`,
      cancel_url: `${siteUrl}/cancel.html`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
