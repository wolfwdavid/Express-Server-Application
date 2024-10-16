const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';

module.exports = function (req, res, next) {
    // Authorization header exists
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    // Extract token from header and remove 'Bearer' prefix
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Token missing, authorization denied' });
    }

    try {
        // Verify token, extract user information
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.userId;  // Assuming your JWT contains userId
        next();  // Pass control to the next middleware or route handler
    } catch (err) {
        console.error('JWT verification failed:', err);
        return res.status(401).json({ error: 'Token is not valid' });
    }
};
app.use(express.urlencoded({ extended: true }));  // Submissions
app.use(express.json());  //JSON data
