const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
router.post("/create-checkout-session", async (req, res) => {
  const { priceId, userId } = req.body;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.FRONTEND_URL}/success?
 session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    metadata: { userId },
  });
  res.json({ sessionId: session.id, url: session.url });
});
module.exports = router;
