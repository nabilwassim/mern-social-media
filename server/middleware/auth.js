import jwt from "jsonwebtoken";

// next parameter will allow us to have the function contunue
export const verifyToken = async (req, res, next) => {
  try {
    // from the request from the front end we grabbing the authorization header
    // thats where the token will be set on the front end
    // or the front end will be setting this and then we can grab it in the back end
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    // we want the token to start with bearer
    // and the token will be placed after a space in the bearer
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }
// ال جي دابليو تي اللي عملتها ف ملف الاي ان في
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
