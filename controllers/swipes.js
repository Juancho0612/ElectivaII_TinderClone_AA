const users = require("../data/users");

const swipes = [];

/**
 * Registra un "swipe" (like o dislike) de un usuario hacia otro.
 * Si ambos usuarios se han dado "like", se considera un match.
 *
 * @param {Object} req - Solicitud de Express con los datos del swipe (userId, targetUserId, action).
 * @param {Object} res - Respuesta de Express.
 * @returns {Object} JSON con el estado del swipe y si hay un match.
 */
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


/**
 * Obtiene la lista de matches de un usuario.
 * Un match ocurre cuando dos usuarios se han dado "like" mutuamente.
 *
 * @param {Object} req - Solicitud de Express con userId en query.
 * @param {Object} res - Respuesta de Express.
 * @returns {Object} JSON con la lista de usuarios que han hecho match.
 */
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
            const matchedUser = users.find(
                (user) => user.id === Number(swipe.targetUserId)
            );

            return matchedUser
                ? {
                    id: matchedUser.id,
                    email: matchedUser.email,
                    firstName: matchedUser.firstName,
                    lastName: matchedUser.lastName,
                    phone: matchedUser.phone,
                }
                : null;
        })
        .filter(Boolean);

    res.status(200).json({ matches });
};

module.exports = { registerSwipe, getMatches };
