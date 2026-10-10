import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateNumericOtp } from '../services/otpService.js';
import { OtpRecord } from '../models/OtpRecord.js';

test('Auth: 6-digit numeric OTP generation format', () => {
  const otp = generateNumericOtp();
  assert.equal(typeof otp, 'string');
  assert.equal(otp.length, 6);
  assert.match(otp, /^[0-9]{6}$/);
});

test('Auth: SHA-256 OTP hashing and verification', () => {
  const plainOtp = '482910';
  const hashed = OtpRecord.hashOtp(plainOtp);
  assert.equal(typeof hashed, 'string');
  assert.equal(hashed.length, 64); // SHA-256 hex string

  const computedHash = crypto.createHash('sha256').update(plainOtp).digest('hex');
  assert.equal(hashed, computedHash);
});

test('Auth: Password hashing with bcryptjs', async () => {
  const password = 'BoutiquePassword123!';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  assert.notEqual(password, hash);
  assert.equal(await bcrypt.compare(password, hash), true);
  assert.equal(await bcrypt.compare('WrongPassword', hash), false);
});
