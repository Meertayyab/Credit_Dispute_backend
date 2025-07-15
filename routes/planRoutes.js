const router = require("express").Router();
const { getAllPlans, subscribeToPlan,getPlanById } = require("../controllers/planController");

router.get("/", getAllPlans);
router.get("/:id",getPlanById); 
router.post("/subscribe", subscribeToPlan); // You can protect this with auth middleware

module.exports = router;
