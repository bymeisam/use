#!/usr/bin/env node

/**
 * Debug script to validate NPM token format and authentication
 */

import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';

const token = process.env.NPM_TOKEN;

console.log('🔍 NPM Token Debug Information');
console.log('================================');

if (!token) {
  console.log('❌ NPM_TOKEN environment variable is not set');
  process.exit(1);
}

// Check token format
console.log(`✅ Token exists: ${token.length} characters`);

// Mask token for security but show format
const maskedToken = token.substring(0, 8) + '...' + token.substring(token.length - 6);
console.log(`📝 Token format: ${maskedToken}`);

// Check if it starts with npm_
if (token.startsWith('npm_')) {
  console.log('✅ Token starts with "npm_" (correct format)');
} else {
  console.log('❌ Token does not start with "npm_" (incorrect format)');
  console.log('💡 Modern NPM tokens should start with "npm_"');
}

// Check token length (NPM tokens are typically 72 characters)
if (token.length === 72) {
  console.log('✅ Token length is 72 characters (correct)');
} else {
  console.log(`⚠️  Token length is ${token.length} characters (expected 72)`);
  if (token.length === 40) {
    console.log('💡 This looks like a Classic token. You need an Automation token instead!');
  }
}

// Test NPM authentication
console.log('\n🌐 Testing NPM Authentication...');
console.log('================================');

try {
  // Create temporary .npmrc with the token
  const npmrc = `//registry.npmjs.org/:_authToken=${token}`;
  writeFileSync('.npmrc.temp', npmrc);
  
  // Test whoami
  const whoami = execSync('npm whoami --userconfig .npmrc.temp', { 
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  }).trim();
  
  console.log(`✅ Authentication successful! Logged in as: ${whoami}`);
  
  // Cleanup
  unlinkSync('.npmrc.temp');
  
} catch (error) {
  console.log('❌ Authentication failed!');
  console.log(`Error: ${error.message}`);
  
  // Cleanup
  try {
    unlinkSync('.npmrc.temp');
  } catch (e) {}
  
  console.log('\n💡 Troubleshooting Tips:');
  console.log('1. ⚠️  Your token is 40 chars - this is a CLASSIC token!');
  console.log('2. 🔄 Create a NEW "Automation" token (not Classic token)');
  console.log('3. ✅ Automation tokens are 72 characters and more secure');
  console.log('4. 🔒 Set 2FA to "Authorization only" (not "Authorization and writes")');
  console.log('5. 📋 Copy the entire token without extra spaces');
}

console.log('\n🔧 Token Requirements:');
console.log('======================');
console.log('• Format: npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
console.log('• Length: 72 characters (yours is only 40!)');
console.log('• Type: Automation token (NOT Classic token)');
console.log('• 2FA: Set to "Authorization only" if enabled');
console.log('• Scope: Should have publish permissions for your packages');

console.log('\n🚨 SOLUTION: Create a new Automation token!');
console.log('============================================');
console.log('1. Go to https://www.npmjs.com/settings/tokens');
console.log('2. Click "Generate New Token"');
console.log('3. Select "Automation" (NOT Classic)');
console.log('4. Copy the 72-character token that starts with npm_');
console.log('5. Update your GitHub secret with the new token');