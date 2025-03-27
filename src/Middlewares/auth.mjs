// middleware/authMiddleware.js
import jwt from 'jsonwebtoken'


// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'] || req.headers['Authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Access denied. No token provided.' });
//   }

//   jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
//     if (err) {
//       return res.status(403).json({ message: 'Invalid token' });
//     }
//     req.user = user;
//     next();
//   });
// };

// export default authenticateToken;

function authenticateToken(req, res, next) {
  const token = req.cookies.token
  
  if (!token) {
      return res.status(401).json({ message: "Authentication required" });
  }

  try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded; // Attach user to request)
      next();
  } catch (err) {
      res.clearCookie('token');
      return res.status(401).json({ message: "Invalid or expired token",token });
  }
}
export default authenticateToken;