#!/usr/bin/env node

/**
 * Quick test to see if the current 40-char token works
 */

import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';

const token = process.argv[2];

if (!token) {
  console.log('Usage: node test-token.js YOUR_TOKEN_HERE');
  process.exit(1);
}

console.log(`Testing token: ${token.substring(0, 8)}...${token.substring(token.length - 4)} (${token.length} chars)`);

try {
  // Create temporary .npmrc
  const npmrc = `//registry.npmjs.org/:_authToken=${token}`;
  writeFileSync('.npmrc.temp', npmrc);
  
  // Test authentication
  const whoami = execSync('npm whoami --userconfig .npmrc.temp', { 
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  }).trim();
  
  console.log(`✅ Token works! Logged in as: ${whoami}`);
  
  // Test if can publish to your package
  try {
    const access = execSync(`npm access get status @bymeisam/use --userconfig .npmrc.temp`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();
    console.log(`✅ Package access: ${access}`);
  } catch (e) {
    console.log('ℹ️  Package access check failed (package might not exist yet)');
  }
  
  unlinkSync('.npmrc.temp');
  
} catch (error) {
  console.log('❌ Token failed!');
  console.log(`Error: ${error.message}`);
  
  try {
    unlinkSync('.npmrc.temp');
  } catch (e) {}
}