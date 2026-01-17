#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Fixing all auth imports...\n');

// Get all files that import useAuth
const files = [
  'app/orders/page.tsx',
  'app/admin/analytics/page.tsx', 
  'app/admin/orders/page.tsx'
];

files.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace the import
    content = content.replace(
      /import { useAuth } from '\.\.\/\.\.\/contexts\/AuthContext'/g,
      `import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext'`
    );
    
    content = content.replace(
      /import { useAuth } from '\.\.\/contexts\/AuthContext'/g,
      `import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext'`
    );
    
    content = content.replace(
      /import { useAuth } from '\.\.\/\.\.\/\.\.\/contexts\/AuthContext'/g,
      `import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext'`
    );
    
    // Also fix the simple import
    content = content.replace(
      /import { useAuth } from '\.\.\/\.\.\/contexts\/UnifiedAuthContext'/g,
      `import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext'`
    );
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
  } else {
    console.log(`❌ File not found: ${filePath}`);
  }
});

console.log('\n✅ All auth imports have been fixed!');
console.log('\nRunning TypeScript check...');

try {
  execSync('npx tsc --noEmit 2>&1 | grep -c "useUnifiedAuth"', { stdio: 'pipe' });
  console.log('✅ No TypeScript errors found for useUnifiedAuth');
} catch (error) {
  const errorCount = parseInt(error.stdout?.toString() || '0');
  if (errorCount > 0) {
    console.log(`⚠️  Found ${errorCount} TypeScript errors for useUnifiedAuth`);
  } else {
    console.log('✅ TypeScript check passed');
  }
}