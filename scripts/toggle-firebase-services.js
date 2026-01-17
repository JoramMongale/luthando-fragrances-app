#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found');
  process.exit(1);
}

let content = fs.readFileSync(envPath, 'utf8');

console.log('Current Firebase Service Settings:');
console.log('=================================\n');

// Extract current values
const useFirestoreMatch = content.match(/NEXT_PUBLIC_USE_FIRESTORE=(true|false)/);
const useStorageMatch = content.match(/NEXT_PUBLIC_USE_FIREBASE_STORAGE=(true|false)/);

const currentFirestore = useFirestoreMatch ? useFirestoreMatch[1] : 'false';
const currentStorage = useStorageMatch ? useStorageMatch[1] : 'false';

console.log(`NEXT_PUBLIC_USE_FIRESTORE: ${currentFirestore}`);
console.log(`NEXT_PUBLIC_USE_FIREBASE_STORAGE: ${currentStorage}\n`);

console.log('Options:');
console.log('1. Enable all services (Auth + Firestore + Storage)');
console.log('2. Auth only (disable Firestore & Storage - RECOMMENDED FOR TESTING)');
console.log('3. Auth + Firestore only');
console.log('4. Auth + Storage only\n');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Select option (1-4): ', (answer) => {
  let newFirestore, newStorage;
  
  switch(answer) {
    case '1':
      newFirestore = 'true';
      newStorage = 'true';
      console.log('\n✅ Enabling ALL Firebase services');
      break;
    case '2':
      newFirestore = 'false';
      newStorage = 'false';
      console.log('\n✅ Enabling Auth ONLY (disabling Firestore & Storage)');
      console.log('   This isolates Auth issues from database/storage problems');
      break;
    case '3':
      newFirestore = 'true';
      newStorage = 'false';
      console.log('\n✅ Enabling Auth + Firestore (disabling Storage)');
      break;
    case '4':
      newFirestore = 'false';
      newStorage = 'true';
      console.log('\n✅ Enabling Auth + Storage (disabling Firestore)');
      break;
    default:
      console.log('\n❌ Invalid option. No changes made.');
      rl.close();
      return;
  }
  
  // Update the values
  if (useFirestoreMatch) {
    content = content.replace(/NEXT_PUBLIC_USE_FIRESTORE=(true|false)/, `NEXT_PUBLIC_USE_FIRESTORE=${newFirestore}`);
  } else {
    // Add if not found
    content += `\nNEXT_PUBLIC_USE_FIRESTORE=${newFirestore}`;
  }
  
  if (useStorageMatch) {
    content = content.replace(/NEXT_PUBLIC_USE_FIREBASE_STORAGE=(true|false)/, `NEXT_PUBLIC_USE_FIREBASE_STORAGE=${newStorage}`);
  } else {
    content += `\nNEXT_PUBLIC_USE_FIREBASE_STORAGE=${newStorage}`;
  }
  
  fs.writeFileSync(envPath, content, 'utf8');
  
  console.log('\n📝 Updated .env.local:');
  console.log(`   NEXT_PUBLIC_USE_FIRESTORE=${newFirestore}`);
  console.log(`   NEXT_PUBLIC_USE_FIREBASE_STORAGE=${newStorage}`);
  console.log('\n⚠️  Restart dev server: npm run dev');
  
  rl.close();
});