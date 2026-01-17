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
    
    // Check if file imports useAuth
    if (content.includes("from '@/contexts/AuthContext'")) {
      // Replace import
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
      
      // Also handle the simple import
      content = content.replace(
        /import { useAuth } from '\.\.\/\.\.\/contexts\/UnifiedAuthContext'/g,
        `import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext'`
      );
      
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated imports in: ${filePath}`);
    } else {
      console.log(`No auth import found in: ${filePath}`);
    }
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log('Done fixing auth imports!');