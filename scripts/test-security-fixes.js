/**
 * Automated Security Fixes Test Runner
 *
 * This script runs automated tests to verify security fixes
 * Run with: node scripts/test-security-fixes.js
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(message) {
  console.log('');
  log('='.repeat(60), 'cyan');
  log(message, 'bright');
  log('='.repeat(60), 'cyan');
  console.log('');
}

function section(message) {
  console.log('');
  log(`>>> ${message}`, 'blue');
  log('-'.repeat(60), 'blue');
}

function pass(message) {
  log(`✅ PASS: ${message}`, 'green');
}

function fail(message) {
  log(`❌ FAIL: ${message}`, 'red');
}

function warn(message) {
  log(`⚠️  WARN: ${message}`, 'yellow');
}

function info(message) {
  log(`ℹ️  INFO: ${message}`, 'cyan');
}

// Test results tracker
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: [],
};

function recordTest(name, passed, message = '') {
  results.total++;
  if (passed) {
    results.passed++;
    pass(`${name}${message ? ': ' + message : ''}`);
  } else {
    results.failed++;
    fail(`${name}${message ? ': ' + message : ''}`);
  }
  results.tests.push({ name, passed, message });
}

// Test functions
function testFileExists(filePath, description) {
  const exists = fs.existsSync(filePath);
  recordTest(
    `File exists: ${description}`,
    exists,
    exists ? filePath : `Not found: ${filePath}`
  );
  return exists;
}

function testFileContains(filePath, searchString, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const contains = content.includes(searchString);
    recordTest(
      description,
      contains,
      contains ? 'Found' : `Not found: "${searchString}"`
    );
    return contains;
  } catch (error) {
    recordTest(description, false, `Error reading file: ${error.message}`);
    return false;
  }
}

function testEnvironmentValidation() {
  section('Test 1: Environment Validation Files');

  testFileExists(
    path.join(__dirname, '../src/lib/config/env-validation.ts'),
    'env-validation.ts'
  );

  testFileExists(
    path.join(__dirname, '../src/instrumentation.ts'),
    'instrumentation.ts'
  );

  testFileContains(
    path.join(__dirname, '../next.config.js'),
    'instrumentationHook: true',
    'instrumentationHook enabled in next.config.js'
  );
}

function testErrorResponseFixes() {
  section('Test 2: Error Response Security Fixes');

  const tenantsRoute = path.join(__dirname, '../src/app/api/super-admin/tenants/route.ts');

  // Check that error.stack is NOT returned in response
  if (fs.existsSync(tenantsRoute)) {
    const content = fs.readFileSync(tenantsRoute, 'utf8');

    // Check that we still log the error (good for debugging)
    const logsError = content.includes('console.error("Error stack:", error.stack)');
    recordTest(
      'Error stack is logged internally',
      logsError,
      logsError ? 'Good - errors logged for debugging' : 'Warning - error logging may be missing'
    );

    // Check that error.stack is NOT in the return statement
    const lines = content.split('\n');
    let inCatchBlock = false;
    let inReturnStatement = false;
    let foundDetailsStack = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.includes('} catch (error')) {
        inCatchBlock = true;
      }

      if (inCatchBlock && line.includes('return NextResponse.json')) {
        inReturnStatement = true;
      }

      if (inReturnStatement && line.includes('details: error.stack')) {
        foundDetailsStack = true;
        break;
      }

      if (inReturnStatement && line.includes('});')) {
        inReturnStatement = false;
        inCatchBlock = false;
      }
    }

    recordTest(
      'Error stack NOT exposed in API response',
      !foundDetailsStack,
      !foundDetailsStack
        ? 'Secure - no stack traces in responses'
        : 'INSECURE - stack traces exposed to clients!'
    );
  } else {
    fail('Could not find tenants route file');
  }
}

function testLoggerUtility() {
  section('Test 3: Logger Utility');

  const loggerPath = path.join(__dirname, '../src/lib/utils/logger.ts');

  testFileExists(loggerPath, 'logger.ts');

  if (fs.existsSync(loggerPath)) {
    const content = fs.readFileSync(loggerPath, 'utf8');

    testFileContains(
      loggerPath,
      'sanitize',
      'Logger has sanitization function'
    );

    testFileContains(
      loggerPath,
      "'password'",
      'Logger sanitizes password fields'
    );

    testFileContains(
      loggerPath,
      "'token'",
      'Logger sanitizes token fields'
    );

    testFileContains(
      loggerPath,
      "'secret'",
      'Logger sanitizes secret fields'
    );

    const hasEnvironmentCheck = content.includes('process.env.NODE_ENV');
    recordTest(
      'Logger is environment-aware',
      hasEnvironmentCheck,
      hasEnvironmentCheck ? 'Different behavior for dev/prod' : 'May not be environment-aware'
    );
  }
}

function testDocumentation() {
  section('Test 4: Documentation');

  testFileExists(
    path.join(__dirname, '../SECURITY_FIXES_COMPLETED.md'),
    'Security fixes documentation'
  );

  testFileExists(
    path.join(__dirname, '../TESTING_SECURITY_FIXES.md'),
    'Testing guide'
  );
}

function testBuildConfiguration() {
  section('Test 5: Build Configuration');

  const packageJsonPath = path.join(__dirname, '../package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      const hasBuildScript = packageJson.scripts && packageJson.scripts.build;
      recordTest(
        'Build script exists',
        hasBuildScript,
        hasBuildScript ? packageJson.scripts.build : 'No build script found'
      );

      const hasDevScript = packageJson.scripts && packageJson.scripts.dev;
      recordTest(
        'Dev script exists',
        hasDevScript,
        hasDevScript ? packageJson.scripts.dev : 'No dev script found'
      );
    } catch (error) {
      fail(`Error parsing package.json: ${error.message}`);
    }
  }
}

function testEnvExample() {
  section('Test 6: Environment Template');

  const envExamplePath = path.join(__dirname, '../.env.example');

  testFileExists(envExamplePath, '.env.example');

  if (fs.existsSync(envExamplePath)) {
    const content = fs.readFileSync(envExamplePath, 'utf8');

    const hasEncryptionKey = content.includes('DB_ENCRYPTION_KEY');
    const hasNextAuthSecret = content.includes('NEXTAUTH_SECRET');
    const hasCronSecret = content.includes('CRON_SECRET');

    recordTest('DB_ENCRYPTION_KEY documented', hasEncryptionKey);
    recordTest('NEXTAUTH_SECRET documented', hasNextAuthSecret);
    recordTest('CRON_SECRET documented', hasCronSecret);

    // Check if it has generation instructions
    const hasInstructions = content.includes('openssl rand -base64 32');
    recordTest(
      'Generation instructions provided',
      hasInstructions,
      hasInstructions ? 'Good - users know how to generate secrets' : 'Consider adding instructions'
    );
  }
}

function checkCurrentEnvironment() {
  section('Test 7: Current Environment Check');

  info('Checking current environment variables...');

  const criticalVars = [
    'DB_ENCRYPTION_KEY',
    'NEXTAUTH_SECRET',
    'CRON_SECRET',
    'MASTER_DATABASE_URL',
  ];

  const placeholderPatterns = [
    'your-secret-key-here',
    'your-encryption-key-here',
    'generate-with-openssl',
    'change-in-production',
    'dev_secret',
  ];

  let allSet = true;
  let anyPlaceholder = false;

  criticalVars.forEach(varName => {
    const value = process.env[varName];

    if (!value) {
      warn(`${varName} is NOT SET (expected in local development)`);
      allSet = false;
    } else {
      const isPlaceholder = placeholderPatterns.some(pattern =>
        value.toLowerCase().includes(pattern)
      );

      if (isPlaceholder) {
        fail(`${varName} contains PLACEHOLDER value`);
        anyPlaceholder = true;
      } else {
        pass(`${varName} is SET`);
      }
    }
  });

  if (!allSet) {
    info('Note: This is expected if you haven\'t set up .env yet');
    info('The validation will prevent deployment with missing secrets');
  }

  if (anyPlaceholder) {
    fail('CRITICAL: Placeholder secrets detected!');
    fail('The new validation will prevent the server from starting');
  } else if (allSet) {
    pass('No placeholder secrets detected');
  }
}

function printSummary() {
  header('Test Summary');

  log(`Total Tests Run: ${results.total}`, 'bright');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`Warnings: ${results.warnings}`, 'yellow');

  const successRate = ((results.passed / results.total) * 100).toFixed(1);
  console.log('');
  log(`Success Rate: ${successRate}%`, successRate >= 90 ? 'green' : successRate >= 70 ? 'yellow' : 'red');

  console.log('');
  if (results.failed === 0) {
    log('🎉 All tests passed! Security fixes are properly implemented.', 'green');
  } else {
    log(`⚠️  ${results.failed} test(s) failed. Review the failures above.`, 'yellow');
  }

  console.log('');
  log('Next Steps:', 'bright');
  log('1. Review any failed tests above', 'cyan');
  log('2. Run manual tests: See TESTING_SECURITY_FIXES.md', 'cyan');
  log('3. Start the server: npm run dev', 'cyan');
  log('4. Test application features work correctly', 'cyan');
  console.log('');
}

// Main execution
function runTests() {
  header('Security Fixes - Automated Test Suite');

  info('This script verifies that security fixes are properly implemented');
  info('For manual testing, see: TESTING_SECURITY_FIXES.md');

  testEnvironmentValidation();
  testErrorResponseFixes();
  testLoggerUtility();
  testDocumentation();
  testBuildConfiguration();
  testEnvExample();
  checkCurrentEnvironment();

  printSummary();

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run the tests
runTests();
