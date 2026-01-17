const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'app/auth/register/page.tsx',
  'app/auth/forgot-password/page.tsx',
  'app/checkout/page.tsx',
  'components/Header.tsx',
  'app/admin/orders/page.tsx',
  'app/admin/analytics/page.tsx',
  'app/cart/page.tsx',
  'app/auth/login/page.tsx',
  'app/admin/layout.tsx',
  'app/orders/page.tsx',
  'app/profile/page.tsx'
];

filesToUpdate.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace import
    content = content.replace(
      /import { useAuth } from '\.\.\/\.\.\/contexts\/AuthContext'/g,
      `import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext'`
    );
    
    // Replace usage
    content = content.replace(/const {([^}]+)} = useAuth\(\)/g, (match, capture) => {
      return `const {${capture}} = useUnifiedAuth()`;
    });
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log('Done updating auth imports!');