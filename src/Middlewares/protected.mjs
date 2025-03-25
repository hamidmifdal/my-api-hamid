import jwt from 'jsonwebtoken'

export default (req, res) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'] || req.headers['Authorization']
  
    // Check if the header exists and is in the correct format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ message: 'No token provided or token is malformed' });
    }
  
    // Extract the token (remove "Bearer " from the header)
    const token = authHeader.split(' ')[1];
  
    // Verify the token
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Failed to authenticate token' });
      }
  
      // If the token is valid, return the protected data
      res.json({ message: 'This is protected data', user: decoded });
    });
}