const users = require("../data/users");

const swipes = [];

const registerSwipe = (req, res) => {
  const { userId, targetUserId, action } = req.body;

  if (!userId || !targetUserId || !action) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (action !== "like" && action !== "dislike") {
    return res.status(400).json({ message: "Invalid action" });
  }

  swipes.push({ userId, targetUserId, action });

  const isMatch = swipes.some(
    (swipe) =>
      swipe.userId === targetUserId &&
      swipe.targetUserId === userId &&
      swipe.action === "like" &&
      action === "like"
  );

  res.status(201).json({
    match: isMatch,
    message: isMatch ? "You have a new match!" : "Swipe registered",
  });
};

const getMatches = (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const matches = swipes
    .filter(
      (swipe) =>
        swipe.userId === userId &&
        swipe.action === "like" &&
        swipes.some(
          (otherSwipe) =>
            otherSwipe.userId === swipe.targetUserId &&
            otherSwipe.targetUserId === userId &&
            otherSwipe.action === "like"
        )
    )
    .map((swipe) => {
      return users.find((user) => user.id === Number(swipe.targetUserId));
    });

  res.status(200).json({ matches });
};

module.exports = { registerSwipe, getMatches };
