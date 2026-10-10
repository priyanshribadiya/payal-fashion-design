import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ENV } from '../config/env.js';
import { User } from '../models/User.js';

async function createInitialAdmin() {
  try {
    console.log('[Admin Setup] Connecting to MongoDB...');
    await mongoose.connect(ENV.MONGODB_URI);

    const email = ENV.INITIAL_ADMIN_EMAIL.trim().toLowerCase();
    const phone = ENV.INITIAL_ADMIN_PHONE.trim();
    const name = ENV.INITIAL_ADMIN_NAME.trim();
    const password = ENV.INITIAL_ADMIN_PASSWORD;

    const existingAdmin = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingAdmin) {
      existingAdmin.role = 'admin';
      existingAdmin.isEmailVerified = true;
      existingAdmin.isPhoneVerified = true;
      const salt = await bcrypt.genSalt(10);
      existingAdmin.passwordHash = await bcrypt.hash(password, salt);
      await existingAdmin.save();
      console.log(`[Admin Setup] Existing account updated to Administrator: ${email}`);
    } else {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      await User.create({
        name,
        email,
        phone,
        passwordHash,
        role: 'admin',
        isEmailVerified: true,
        isPhoneVerified: true,
      });
      console.log(`[Admin Setup] New Administrator account created: ${email}`);
    }

    console.log('\n==================================================');
    console.log(' 👑 ADMINISTRATOR INITIALIZED');
    console.log(` Email:    ${email}`);
    console.log(` Phone:    ${phone}`);
    console.log(` Role:     admin`);
    console.log('==================================================\n');
  } catch (error) {
    console.error('[Admin Setup] Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Admin Setup] Disconnected cleanly.');
  }
}

createInitialAdmin();
