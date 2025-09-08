#!/usr/bin/env node

/**
 * Debug script to validate NPM token format and authentication
 */

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
}

// Test NPM authentication
console.log('\n🌐 Testing NPM Authentication...');
console.log('================================');

const { execSync } = require('child_process');

try {
  // Create temporary .npmrc with the token
  const npmrc = `//registry.npmjs.org/:_authToken=${token}`;
  require('fs').writeFileSync('.npmrc.temp', npmrc);
  
  // Test whoami
  const whoami = execSync('npm whoami --userconfig .npmrc.temp', { 
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  }).trim();
  
  console.log(`✅ Authentication successful! Logged in as: ${whoami}`);
  
  // Cleanup
  require('fs').unlinkSync('.npmrc.temp');
  
} catch (error) {
  console.log('❌ Authentication failed!');
  console.log(`Error: ${error.message}`);
  
  // Cleanup
  try {
    require('fs').unlinkSync('.npmrc.temp');
  } catch (e) {}
  
  console.log('\n💡 Troubleshooting Tips:');
  console.log('1. Make sure you created an "Automation" token (not Classic)');
  console.log('2. Check if 2FA is set to "Authorization only" (not "Authorization and writes")');
  console.log('3. Verify the token was copied correctly without extra spaces');
  console.log('4. Try generating a new token if this one is old');
}

console.log('\n🔧 Token Requirements:');
console.log('======================');
console.log('• Format: npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
console.log('• Length: 72 characters');
console.log('• Type: Automation token (recommended for CI/CD)');
console.log('• 2FA: Set to "Authorization only" if enabled');
console.log('• Scope: Should have publish permissions for your packages');