import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { createAndSendOtp, verifyOtp } from '../services/otpService.js';
import { ENV } from '../config/env.js';

/**
 * Helper to generate JWT token for a user.
 */
function generateToken(user) {
  return jwt.sign(
    { userId: user._id, role: user.role, email: user.email },
    ENV.JWT_SECRET,
    { expiresIn: ENV.JWT_EXPIRES_IN }
  );
}

/**
 * Register a new customer
 */
export async function register(req, res, next) {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, phone number, and password are required.',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and confirm password do not match.',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.',
      });
    }

    // Check for existing user
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim().replace(/\s+/g, '');

    const existingUser = await User.findOne({
      $or: [{ email: cleanEmail }, { phone: cleanPhone }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address or phone number already exists.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash,
      role: 'customer',
      isEmailVerified: false,
      isPhoneVerified: false,
    });

    // Send initial OTPs for verification
    const emailOtpInfo = await createAndSendOtp(cleanEmail, 'registration_email');
    const phoneOtpInfo = await createAndSendOtp(cleanPhone, 'registration_phone');

    return res.status(201).json({
      success: true,
      message: 'Account created! Please verify your email or phone with the OTP sent.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      emailOtpExpiresInMinutes: emailOtpInfo.expiresInMinutes,
      sandboxEmailOtp: emailOtpInfo.sandboxCode,
      sandboxPhoneOtp: phoneOtpInfo.sandboxCode,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Verify Email or Phone OTP
 */
export async function verifyRegistrationOtp(req, res, next) {
  try {
    const { identifier, purpose, otp } = req.body;

    if (!identifier || !purpose || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Identifier, purpose, and 6-digit OTP code are required.',
      });
    }

    const verificationResult = await verifyOtp(identifier, purpose, otp);
    if (!verificationResult.valid) {
      return res.status(400).json({
        success: false,
        message: verificationResult.message,
      });
    }

    // Update user record
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    if (purpose === 'registration_email') {
      user.isEmailVerified = true;
    } else if (purpose === 'registration_phone') {
      user.isPhoneVerified = true;
    }
    await user.save();

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Verification successful! Welcome to Payal Fashion Design.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Customer Login
 */
export async function login(req, res, next) {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number and password are required.',
      });
    }

    const cleanId = identifier.trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ email: cleanId }, { phone: identifier.trim() }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email/phone and password.',
      });
    }

    if (user.isLocked()) {
      return res.status(403).json({
        success: false,
        message: 'Account is temporarily locked due to repeated failed attempts. Please try again in 15 minutes.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
      }
      await user.save();

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email/phone and password.',
      });
    }

    // Reset failed attempts on success
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Resend OTP
 */
export async function resendOtp(req, res, next) {
  try {
    const { identifier, purpose } = req.body;
    if (!identifier || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Identifier and purpose are required.',
      });
    }

    const otpInfo = await createAndSendOtp(identifier, purpose);
    return res.json({
      success: true,
      message: 'A fresh OTP has been dispatched.',
      expiresInMinutes: otpInfo.expiresInMinutes,
      sandboxCode: otpInfo.sandboxCode,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Initiate Forgot Password
 */
export async function forgotPassword(req, res, next) {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Email address or mobile number is required.',
      });
    }

    const cleanId = identifier.trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ email: cleanId }, { phone: identifier.trim() }],
    });

    // Do not reveal whether user exists for public safety
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists with this contact, a reset OTP has been sent.',
      });
    }

    const target = cleanId.includes('@') ? user.email : user.phone;
    const otpInfo = await createAndSendOtp(target, 'password_reset');

    return res.json({
      success: true,
      message: 'If an account exists with this contact, a reset OTP has been sent.',
      target,
      expiresInMinutes: otpInfo.expiresInMinutes,
      sandboxCode: otpInfo.sandboxCode,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Reset Password with Verified OTP
 */
export async function resetPassword(req, res, next) {
  try {
    const { identifier, otp, newPassword, confirmPassword } = req.body;

    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Identifier, OTP, and new password are required.',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters.',
      });
    }

    const verifyResult = await verifyOtp(identifier, 'password_reset', otp);
    if (!verifyResult.valid) {
      return res.status(400).json({
        success: false,
        message: verifyResult.message,
      });
    }

    const cleanId = identifier.trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ email: cleanId }, { phone: identifier.trim() }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    return res.json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get current authenticated user profile
 */
export async function getMe(req, res) {
  return res.json({
    success: true,
    user: req.user,
  });
}
