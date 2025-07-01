import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // const authHeader = req.headers["authorization"];
  // const accessToken = authHeader && authHeader.split(" ")[1]; // Lấy token từ "Bearer <token>"
  const accessToken = req.cookies.accessToken;
  console.log("accessToken", accessToken);
  console.log("req.cookies", req.cookies);
  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(403).json({ message: "Invalid token" });
  }
};
