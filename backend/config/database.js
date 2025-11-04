const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestion_aprendizaje',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: 'utf8mb4' // Importante para MariaDB
});

// Probar conexión al iniciar
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión exitosa a MariaDB');
    console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
    console.log(`🔌 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    
    // Verificar versión de MariaDB
    const [rows] = await connection.query('SELECT VERSION() as version');
    console.log(`🔧 Versión: ${rows[0].version}`);
    
    connection.release();
  } catch (err) {
    console.error('❌ Error conectando a MariaDB:', err.message);
    console.error('💡 Verifica que MariaDB esté corriendo y las credenciales sean correctas');
  }
};

testConnection();

module.exports = pool;