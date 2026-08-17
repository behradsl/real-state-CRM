import { PrismaClient } from '@prisma/client';
import * as mysql from 'mysql2/promise';
import { config } from 'dotenv';

config();

const prisma = new PrismaClient();

async function clearIranCitiesTables(): Promise<void> {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Parse the database URL to get the connection details
  const matches = dbUrl.match(/mysql:\/\/(.+):(.+)@(.+):(\d+)\/(.+)/);
  if (!matches) {
    throw new Error('Invalid DATABASE_URL format');
  }

  // Extract the database name and remove any query parameters
  let [, user, password, host, port, database] = matches;
  if (database.includes('?')) {
    database = database.split('?')[0];
  }
  
  const connection = await mysql.createConnection({
    host,
    user,
    password,
    database,
    port: parseInt(port, 10),
    multipleStatements: true,
  });

  try {
    console.log('Clearing Iran cities tables...');
    
    // Disable foreign key checks to avoid constraint issues
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0;');
    
    // Tables to clear in order (child tables first)
    const tables = ['abadi', 'shahr', 'dehestan', 'bakhsh', 'shahrestan', 'ostan'];
    
    for (const table of tables) {
      try {
        console.log(`Truncating table: ${table}`);
        await connection.execute(`TRUNCATE TABLE ${table};`);
      } catch (error) {
        console.warn(`Error truncating table ${table}: ${error.message}`);
      }
    }
    
    // Re-enable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1;');
    
    console.log('Iran cities tables cleared successfully.');
  } finally {
    await connection.end();
  }
}

async function main() {
  try {
    await clearIranCitiesTables();
  } catch (error) {
    console.error('Error clearing Iran cities tables:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 