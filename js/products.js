// ============================================================
// PRODUCT CATALOG
// Edit this file to change what you sell. Prices are in USD cents
// (Stripe works in the smallest currency unit, so $39.00 = 3900).
// "cost" is what you'll pay your supplier per unit — used only to
// show YOU your margin in the admin notes, never shown to customers.
// ============================================================

const PRODUCTS = [
  {
    id: "red-light-mask",
    name: "Lumen Glow Red Light Therapy Mask",
    tagline: "Bring the spa treatment home.",
    price: 5900, // $59.00
    cost: 1400,  // your approx supplier cost — for your reference only
    compareAt: 8900,
    description:
      "A flexible silicone LED mask using red and near-infrared light, the same wellness-gadget category driving the biggest search spikes this year. Designed for a relaxing 10–20 minute session at home — no clinic visit required.",
    bullets: [
      "3 light modes (red / infrared / combo)",
      "Soft flexible silicone, adjustable strap",
      "USB-C rechargeable, cordless during use",
      "Built-in auto shut-off timer"
    ],
    image: "images/red-light-mask.svg",
    badge: "Trending"
  },
  {
    id: "posture-corrector",
    name: "Upright Ease Posture Corrector",
    tagline: "Sit smarter. Stand taller.",
    price: 2900,
    cost: 600,
    compareAt: 4200,
    description:
      "A breathable adjustable brace that gently pulls the shoulders back to retrain posture during desk work — one of this season's steadiest sellers for anyone back at a desk for school or work.",
    bullets: [
      "Adjustable for XS–XL",
      "Breathable mesh, wearable under clothing",
      "Lightweight, no bulky metal frame",
      "Works for desk, gym, or daily wear"
    ],
    image: "images/posture-corrector.svg",
    badge: "Back-to-desk pick"
  },
  {
    id: "mini-massage-gun",
    name: "Pocket Ease Mini Massage Gun",
    tagline: "Full recovery, palm-sized.",
    price: 3900,
    cost: 900,
    compareAt: 5900,
    description:
      "A compact percussion massager small enough for a bag or desk drawer. Popular as an affordable at-home substitute for regular massage-therapy visits.",
    bullets: [
      "4 speed settings",
      "3 interchangeable heads",
      "Under 1 lb, travel-ready",
      "Quiet motor — usable at a desk"
    ],
    image: "images/mini-massage-gun.svg",
    badge: null
  },
  {
    id: "weighted-eye-mask",
    name: "Calm Layer Weighted Eye Mask",
    tagline: "Gentle pressure. Deeper rest.",
    price: 2400,
    cost: 500,
    compareAt: 3400,
    description:
      "A lightly weighted, contoured eye mask designed to block light and add calming pressure — part of the wave of low-cost comfort products replacing pricier sleep and relaxation aids.",
    bullets: [
      "100% light-blocking contoured fit",
      "Washable outer cover",
      "Adjustable strap, side-sleeper friendly",
      "Travel pouch included"
    ],
    image: "images/weighted-eye-mask.svg",
    badge: null
  }
];

function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

function formatPrice(cents) {
  return "$" + (cents / 100).toFixed(2);
}
