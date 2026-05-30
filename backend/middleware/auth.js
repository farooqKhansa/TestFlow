const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'testflow_secret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    req.user = decoded;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

const isLeadOrAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'lead_tester') {
    return res.status(403).json({ error: 'Lead Tester or Admin access required' });
  }
  next();
};

module.exports = { verifyToken, isAdmin, isLeadOrAdmin };