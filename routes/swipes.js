const express = require("express");
const { registerSwipe, getMatches } = require("../controllers/swipes");

const router = express.Router();

router.post("/swipes", registerSwipe);
router.get("/matches", getMatches);

module.exports = router;
