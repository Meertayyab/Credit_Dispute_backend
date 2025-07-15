// const express = require("express");
// const router = express.Router();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const bodyParser = require("body-parser");
// router.post(
//   "/",
//   bodyParser.raw({ type: "application/json" }),
//   async (req, res) => {
//     const sig = req.headers["stripe-signature"];
//     let event;
//     try {
//       event = stripe.webhooks.constructEvent(
//         req.body,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );
//     } catch (err) {
//       return res.status(400).send(`Webhook Error: ${err.message}`);
//     }
//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;
//       const userId = session.metadata.userId;
//       const subscriptionId = session.subscription;
//       // Update DB here
//     }
//     res.status(200).end();
//   }
// );
// module.exports = router;
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bodyParser = require("body-parser");
const Plan = require("../models/Plan");

router.post("/webhook", bodyParser.raw({ type: "application/json" }), async (req, res) => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const planId = session.metadata.planId;

    await User.findByIdAndUpdate(userId, {
      plan: planId,
      subscriptionStatus: "active",
      subscriptionStart: new Date(),
    });

    console.log(`✅ Subscription activated for user ${userId}`);
  }

  res.json({ received: true });
});

module.exports = router;