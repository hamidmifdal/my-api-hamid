import jwt from 'jsonwebtoken'

// export default (req, res) => {
//     // Extract the token from the Authorization header
//     const authHeader = req.headers['authorization'] || req.headers['Authorization']
  
//     // Check if the header exists and is in the correct format
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(403).json({ message: 'No token provided or token is malformed' });
//     }
  
//     // Extract the token (remove "Bearer " from the header)
//     const token = authHeader.split(' ')[1];
  
//     // Verify the token
//     jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ message: 'Failed to authenticate token' });
//       }
  
//       // If the token is valid, return the protected data
//       res.json({ message: 'This is protected data', user: decoded });
//     });
// }


export default (req, res) => {
  // Extract the token from cookies instead of Authorization header
  const token = req.cookies.token || (req.headers.authorization?.startsWith('token') 
  ? req.headers.authorization.split(' ')[1] 
  : null);

  // Check if the cookie exists
  if (!token) {
    return res.status(403).json({ message: 'No authentication token found in cookies' });
  }

  // Verify the token
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      // Clear the invalid token cookie
      res.clearCookie('token');
      
      return res.status(401).json({ 
        message: 'Failed to authenticate token',
        error: err.message 
      });
    }

    // Optionally refresh the token and set a new cookie
    const newToken = jwt.sign(
      { user: decoded.user }, 
      process.env.SECRET_KEY, 
      { expiresIn: '1h' }
    );
    
    res.cookie('token', newToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      // sameSite: 'strict',
      // maxAge: 3600000 // 1 hour
    });

    // If the token is valid, return the protected data
    res.json({ 
      message: 'This is protected data', 
      user: decoded,
      // token: newToken // Optional: return the new token in response
    });
    console.log(user)
  });
}