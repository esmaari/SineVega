const mysql = require('mysql2/promise');

// MySQL bağlantısı – kendi bilgilerinizle güncelle
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    database: 'sinevega',
});

async function deleteInactiveUsers() {
    try {
        console.log('[AutoCleanup] Checking for inactive users...');

        // 7 günden eski kullanıcıları bul
        const [users] = await db.query(`
      SELECT id FROM users WHERE lastActive < NOW() - INTERVAL 24 HOUR
    `);

        const ids = users.map((u) => u.id);

        if (ids.length === 0) {
            console.log('[AutoCleanup] No inactive users found.');
            await db.end();
            return;
        }

        console.log(`[AutoCleanup] Deleting ${ids.length} inactive users...`);

        // Önce favorileri sil, sonra kullanıcıları
        await db.query(`DELETE FROM favorites WHERE user_id IN (?)`, [ids]);
        await db.query(`DELETE FROM users WHERE id IN (?)`, [ids]);
        

        console.log('[AutoCleanup] Cleanup complete.');
    } catch (err) {
        console.error('[AutoCleanup] Error:', err);
    }
    await db.end();

}

deleteInactiveUsers();


