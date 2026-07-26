// scripts/create-admin.js
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Parse .env.local manually (no dotenv needed)
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ File .env.local not found at:', envPath);
    process.exit(1);
  }
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split('\n').forEach((line) => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
  return env;
}

(async () => {
  const env = loadEnv();
  const username = process.argv[2] || 'admin';
  const password = process.argv[3] || 'admin123';

  if (!env.DB_HOST || !env.DB_USER || !env.DB_NAME) {
    console.error('❌ Missing DB config in .env.local');
    console.error('Required: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
    process.exit(1);
  }

  console.log(`🔐 Hashing password for "${username}"...`);
  const hash = await bcrypt.hash(password, 10);

  console.log(`🔌 Connecting to MySQL: ${env.DB_HOST}/${env.DB_NAME}`);
  const conn = await mysql.createConnection({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD || '',
    database: env.DB_NAME,
  });

  try {
    await conn.execute(
      `INSERT INTO admin_users (username, password_hash) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE password_hash = ?`,
      [username, hash, hash]
    );
    console.log(`\n✅ Admin created/updated successfully!`);
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log(`\n🌐 Login at: http://localhost:3000/secret-admin/login\n`);
  } catch (err) {
    console.error('❌ Database error:', err.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
})();
