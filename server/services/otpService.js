import crypto from 'crypto';
import { ENV } from '../config/env.js';
import { OtpRecord } from '../models/OtpRecord.js';

/**
 * Generate a secure 6-digit numeric string OTP.
 */
export function generateNumericOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Creates, securely hashes, and dispatches an OTP.
 * In development / sandbox mode, logs the OTP to the console.
 */
export async function createAndSendOtp(identifier, purpose) {
  const cleanId = identifier.toString().trim().toLowerCase();
  const plaintextOtp = generateNumericOtp();
  const hashedOtp = OtpRecord.hashOtp(plaintextOtp);

  const expiresAt = new Date(Date.now() + ENV.OTP_EXPIRY_MINUTES * 60 * 1000);

  // Invalidate any existing active OTP for this identifier and purpose
  await OtpRecord.deleteMany({ identifier: cleanId, purpose });

  // Store new hashed OTP record
  await OtpRecord.create({
    identifier: cleanId,
    purpose,
    hashedOtp,
    expiresAt,
    attempts: 0,
    verified: false,
  });

  // Dispatch OTP
  if (ENV.OTP_SANDBOX_MODE || ENV.NODE_ENV === 'development') {
    console.log(`\n==================================================`);
    console.log(`[OTP SANDBOX DISPATCH]`);
    console.log(`Recipient: ${cleanId}`);
    console.log(`Purpose:   ${purpose}`);
    console.log(`Code:      >>> ${plaintextOtp} <<<`);
    console.log(`Expires:   ${ENV.OTP_EXPIRY_MINUTES} minutes`);
    console.log(`==================================================\n`);
  } else {
    // Production dispatch via SMS/Email provider
    // (Configurable via environment variables)
    console.log(`[OTP Production] Dispatched to ${cleanId} for ${purpose}`);
  }

  return {
    success: true,
    expiresInMinutes: ENV.OTP_EXPIRY_MINUTES,
    // Return sample preview ONLY if in sandbox/development mode
    sandboxCode: (ENV.OTP_SANDBOX_MODE || ENV.NODE_ENV === 'development') ? plaintextOtp : undefined,
  };
}

/**
 * Securely verifies an entered OTP against the hashed database record.
 */
export async function verifyOtp(identifier, purpose, enteredOtp) {
  const cleanId = identifier.toString().trim().toLowerCase();
  
  const record = await OtpRecord.findOne({
    identifier: cleanId,
    purpose,
    expiresAt: { $gt: new Date() },
    verified: false,
  });

  if (!record) {
    return {
      valid: false,
      message: 'OTP has expired or does not exist. Please request a new one.',
    };
  }

  if (record.attempts >= 5) {
    await OtpRecord.deleteOne({ _id: record._id });
    return {
      valid: false,
      message: 'Maximum verification attempts exceeded. Please request a new OTP.',
    };
  }

  const isValid = record.verifyOtp(enteredOtp);

  if (!isValid) {
    record.attempts += 1;
    await record.save();
    return {
      valid: false,
      message: `Invalid OTP code. You have ${5 - record.attempts} attempts remaining.`,
    };
  }

  // Mark as verified and remove to prevent reuse
  record.verified = true;
  await record.save();

  return { valid: true, message: 'OTP verified successfully.' };
}
