import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protectRoute = async (req, res, next) => {
  console.log("COKIES", req);
  console.log("COKIES", req.cookies);
  try {
    const token = req.cookies.jwt
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid token" });
    }

    const currentUser = await User.findById(decoded.id);

    req.user = currentUser;

    next();
  } catch (error) {
    console.log("Error in auth middleware:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid token" });
    } else {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
};
