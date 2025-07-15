const Plan = require("../models/Plan");
const User = require("../models/User");

exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find({});
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch plans" });
  }
};

exports.subscribeToPlan = async (req, res) => {
  const { userId, packageName } = req.body;

  try {
    const plan = await Plan.findOne({ packageName });
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    await User.findByIdAndUpdate(userId, {
      plan: plan.planType,
      packageName: plan.packageName,
      peopleLimit: plan.peopleLimit,
      subscriptionStatus: "active",
    });

    res.json({ message: "Subscription updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Subscription failed", error: err.message });
  }
};

exports.getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch plan", error: err.message });
  }
};
