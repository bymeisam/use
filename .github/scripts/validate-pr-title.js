#!/usr/bin/env node

/**
 * Validates PR title follows conventional commit format
 * Usage: node validate-pr-title.js "feat: add new feature"
 */

const prTitle = process.argv[2];

if (!prTitle) {
  console.error('❌ Error: No PR title provided');
  console.error('Usage: node validate-pr-title.js "PR_TITLE"');
  process.exit(1);
}

// Conventional commit pattern
const conventionalCommitPattern = /^(feat|fix|docs|style|refactor|test|chore|ci)(\(.+\))?(!)?: .{1,50}$/;

// Breaking change patterns
const breakingChangePatterns = [
  /^(feat|fix|docs|style|refactor|test|chore|ci)(\(.+\))?!: .{1,50}$/,
  /BREAKING CHANGE:/i
];

function validateTitle(title) {
  const errors = [];
  const warnings = [];
  
  // Basic format validation
  if (!conventionalCommitPattern.test(title)) {
    errors.push('PR title must follow conventional commit format: <type>[optional scope]: <description>');
    
    // Specific error messages
    if (!title.includes(':')) {
      errors.push('Missing colon (:) after type/scope');
    }
    
    const typeMatch = title.match(/^([a-z]+)/);
    if (!typeMatch) {
      errors.push('Type must start with lowercase letter');
    } else {
      const type = typeMatch[1];
      const validTypes = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'ci'];
      if (!validTypes.includes(type)) {
        errors.push(`Invalid type "${type}". Valid types: ${validTypes.join(', ')}`);
      }
    }
    
    const descriptionMatch = title.match(/: (.+)$/);
    if (descriptionMatch) {
      const description = descriptionMatch[1];
      if (description.length === 0) {
        errors.push('Description cannot be empty');
      } else if (description.length > 50) {
        warnings.push(`Description is ${description.length} characters (recommended max: 50)`);
      } else if (description[0] !== description[0].toLowerCase()) {
        warnings.push('Description should start with lowercase letter');
      } else if (description.endsWith('.')) {
        warnings.push('Description should not end with period');
      }
    }
  }
  
  // Check length
  if (title.length > 72) {
    errors.push(`Title too long (${title.length} chars). Maximum 72 characters recommended.`);
  }
  
  // Analyze version impact
  let versionImpact = 'none';
  const isBreaking = breakingChangePatterns.some(pattern => pattern.test(title));
  
  if (isBreaking) {
    versionImpact = 'major (breaking change)';
  } else if (title.startsWith('feat')) {
    versionImpact = 'minor (new feature)';
  } else if (title.startsWith('fix')) {
    versionImpact = 'patch (bug fix)';
  }
  
  return { errors, warnings, versionImpact };
}

function printResults(title, validation) {
  console.log('\n📝 PR Title Validation Results');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Title: "${title}"`);
  console.log(`Length: ${title.length} characters`);
  
  if (validation.versionImpact !== 'none') {
    console.log(`📦 Version Impact: ${validation.versionImpact}`);
  }
  
  if (validation.errors.length === 0 && validation.warnings.length === 0) {
    console.log('✅ Valid conventional commit format!');
    return true;
  }
  
  if (validation.errors.length > 0) {
    console.log('\n❌ Errors:');
    validation.errors.forEach(error => console.log(`   • ${error}`));
  }
  
  if (validation.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    validation.warnings.forEach(warning => console.log(`   • ${warning}`));
  }
  
  console.log('\n📖 Format Examples:');
  console.log('   feat: add useToggle hook');
  console.log('   fix: resolve memory leak in useEffect');
  console.log('   feat!: change useCounter API (breaking change)');
  console.log('   docs: update README examples');
  console.log('   chore(deps): update typescript to v5.1');
  
  console.log('\n🔗 More info: https://www.conventionalcommits.org/');
  
  return validation.errors.length === 0;
}

const validation = validateTitle(prTitle);
const isValid = printResults(prTitle, validation);

process.exit(isValid ? 0 : 1);