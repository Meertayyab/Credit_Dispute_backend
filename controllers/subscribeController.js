const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Plan = require("../models/Plan");

exports.createCheckoutSession = async (req, res) => {
  const { userId, planId } = req.body;
  try {
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
            },
            unit_amount: plan.price * 100,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/plans?cancelled=true`,
      metadata: {
        userId,
        planId,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: "Stripe session error", error: err.message });
  }
};