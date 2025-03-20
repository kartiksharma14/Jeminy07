// middleware/deviceAuthMiddleware.js
const { Op } = require('sequelize');
const ClientSubscription = require('../models/clientSubscription');
const ClientLoginDevice = require('../models/clientLoginDevice');
const crypto = require('crypto');

/**
 * Generate a device fingerprint based on user agent and other browser attributes
 * @param {Object} req - Express request object
 * @returns {Object} - Device fingerprint and other device information
 */
const generateDeviceFingerprint = (req) => {
  const userAgent = req.headers['user-agent'] || '';
  const ip = req.ip || req.connection.remoteAddress;
  const acceptLanguage = req.headers['accept-language'] || '';
  
  // Create a combined string of available browser attributes
  const attributes = {
    userAgent,
    ip,
    acceptLanguage,
    // Add more attributes if needed
  };
  
  // Generate a hash from the combined attributes
  const attributesString = JSON.stringify(attributes);
  const deviceFingerprint = crypto
    .createHash('sha256')
    .update(attributesString)
    .digest('hex');
  
  // Generate a unique login ID for this device
  const loginId = generateLoginId(req);
  
  return {
    fingerprint: deviceFingerprint,
    loginId,
    userAgent,
    ipAddress: ip
  };
};

/**
 * Generate a unique login ID for the device
 * @param {Object} req - Express request object
 * @returns {String} - A unique login ID
 */
const generateLoginId = (req) => {
  // Get recruiter info if available
  const recruiter = req.recruiter || {};
  const prefix = recruiter.company_name 
    ? recruiter.company_name.substring(0, 3).toUpperCase() 
    : 'DEV';
  
  // Generate a random ID with timestamp to ensure uniqueness
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
};

/**
 * Middleware to check device authentication and enforce device limits
 */
const deviceAuthMiddleware = async (req, res, next) => {
  // Skip if not a recruiter request
  if (!req.recruiter) {
    return next();
  }
  
  try {
    const recruiterId = req.recruiter.recruiter_id;
    
    // Get device fingerprint
    const deviceInfo = generateDeviceFingerprint(req);
    
    // Check for active subscription
    const subscription = await ClientSubscription.findOne({
      where: {
        client_id: recruiterId,
        is_active: true,
        start_date: { [Op.lte]: new Date() },
        end_date: { 
          [Op.or]: [
            { [Op.is]: null }, // No end date (unlimited)
            { [Op.gte]: new Date() } // End date is in the future
          ]
        }
      }
    });
    
    if (!subscription) {
      return res.status(403).json({
        success: false,
        message: 'You do not have an active subscription. Please contact admin.',
        errorCode: 'NO_ACTIVE_SUBSCRIPTION'
      });
    }
    
    // Check if this device is already registered
    const existingDevice = await ClientLoginDevice.findOne({
      where: {
        client_id: recruiterId,
        fingerprint: deviceInfo.fingerprint,
        is_active: true
      }
    });
    
    if (existingDevice) {
      // Update last login time
      await existingDevice.update({
        last_login: new Date(),
        user_agent: deviceInfo.userAgent
      });
      
      // Continue to next middleware
      return next();
    }
    
    // Count active devices for this recruiter
    const activeDevices = await ClientLoginDevice.findAll({
      where: {
        client_id: recruiterId,
        is_active: true
      }
    });
    
    // Check if limit reached
    if (activeDevices.length >= subscription.login_allowed) {
      return res.status(403).json({
        success: false,
        message: `You are already logged in on ${activeDevices.length} device(s). Maximum allowed is ${subscription.login_allowed}. Please log out from another device or contact admin.`,
        errorCode: 'DEVICE_LIMIT_REACHED',
        activeDevices: activeDevices.map(device => ({
          login_id: device.login_id,
          last_login: device.last_login
        }))
      });
    }
    
    // Register new device
    await ClientLoginDevice.create({
      client_id: recruiterId,
      login_id: deviceInfo.loginId,
      fingerprint: deviceInfo.fingerprint,
      user_agent: deviceInfo.userAgent,
      start_date: new Date(),
      end_date: subscription.end_date,
      last_login: new Date(),
      is_active: true
    });
    
    // Continue to next middleware
    next();
  } catch (error) {
    console.error('Device authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during device authentication',
      error: error.message
    });
  }
};

module.exports = {
  deviceAuthMiddleware,
  generateDeviceFingerprint
};