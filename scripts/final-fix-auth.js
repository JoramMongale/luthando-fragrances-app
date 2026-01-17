const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'app/admin/analytics/page.tsx',
  'app/admin/layout.tsx',
  'app/admin/orders/page.tsx',
  'app/auth/forgot-password/page.tsx',
  'app/auth/login/page.tsx',
  'app/auth/register/page.tsx',
  'app/cart/page.tsx',
  'app/checkout/page.tsx',
  'app/orders/page.tsx',
  'app/profile/page.tsx',
  'components/Header.tsx'
];

filesToUpdate.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    let updated = false;
    
    // Pattern 1: import { useAuth } from '@/contexts/AuthContext'
    if (content.includes("from '@/contexts/AuthContext'")) {
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
      
      // Direct import
      content = content.replace(
        /import { useAuth } from '\.\.\/\.\.\/contexts\/UnifiedAuthContext'/g,
        `import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext'`
      );
      
      content = content.replace(
        /import { useAuth } from '\.\.\/contexts\/UnifiedAuthContext'/g,
        `import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext'`
      );
      
      // The main one
      content = content.replace(
        /import { useAuth } from '\.\.\/\.\.\/contexts\/AuthContext'/g,
        `import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext'`
      );
      
      content = content.replace(
        /import { useAuth } from '\.\.\/\.\.\/contexts\/UnifiedAuthContext'/g,
        `import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext'`
      );
      
      updated = true;
    }
    
    // Pattern 2: Simple replace
    content = content.replace(
      /import { useAuth } from '\.\.\/\.\.\/contexts\/AuthContext'/g,
      `import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext'`
    );
    
    // Also fix any remaining useAuth calls that might have wrong import
    if (content.includes('useUnifiedAuth()') && content.includes("from '@/contexts/AuthContext'")) {
      content = content.replace(
        /import { useAuth } from '\.\.\/\.\.\/contexts\/AuthContext'/g,
        `import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext'`
      );
      updated = true;
    }
    
    if (updated) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
    } else {
      console.log(`⚠️  No changes needed: ${filePath}`);
    }
  } else {
    console.log(`❌ File not found: ${filePath}`);
  }
});

console.log('\nDone fixing all auth imports!');