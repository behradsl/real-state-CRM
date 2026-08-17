import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as mysql from 'mysql2/promise';
import { config } from 'dotenv';

config();

const prisma = new PrismaClient();

async function parseSQLFile(filePath: string): Promise<string[]> {
  const sql = fs.readFileSync(filePath, 'utf8');
  // Split the SQL file into individual statements
  return sql
    .split(';')
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0);
}

async function executeRawSQL(statements: string[]): Promise<void> {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Parse the database URL to get the connection details
  const matches = dbUrl.match(/mysql:\/\/(.+):(.+)@(.+):(\d+)\/(.+)\?/);
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
    console.log('Executing INSERT statements in dependency order...');

    // Skip CREATE TABLE statements and get all INSERT statements
    const allInsertStatements = statements.filter((stmt) =>
      stmt.trim().toUpperCase().includes('INSERT INTO'),
    );

    console.log(`Found ${allInsertStatements.length} total INSERT statements`);

    // Define the order of tables based on dependencies
    const tableOrder = [
      'ostan',
      'shahrestan',
      'bakhsh',
      'dehestan',
      'shahr',
      'abadi',
    ];

    // Process each table in order
    for (const table of tableOrder) {
      // Special handling for shahr table to fix column mismatch
      if (table === 'shahr') {
        console.log('Special handling for shahr table...');
        const shahrInserts = allInsertStatements.filter((stmt) =>
          stmt.toUpperCase().includes(`INSERT INTO \`${table.toUpperCase()}\``),
        );

        console.log(
          `Found ${shahrInserts.length} shahr INSERT statements to transform`,
        );

        if (shahrInserts.length > 0) {
          // Clear existing data
          await connection.execute('DELETE FROM `shahr`');
          await connection.execute('ALTER TABLE `shahr` AUTO_INCREMENT = 1');

          let successCount = 0;
          let errorCount = 0;

          for (const stmt of shahrInserts) {
            try {
              // Extract values from the statement
              const valuesMatch = /VALUES\s*\(([^)]+)\)/i.exec(stmt);
              if (valuesMatch) {
                const values = valuesMatch[1].split(',').map((v) => v.trim());

                console.log(
                  `Processing statement with ${values.length} values`,
                );
                if (values.length < 7) {
                  console.warn(
                    `Skipping statement with too few values: ${values.length}`,
                  );
                  continue;
                }

                // For debugging the first statement
                if (successCount === 0) {
                  console.log('Raw values:', values);
                }

                // Clean up the values - remove surrounding quotes
                const cleanValues = values.map((val) => {
                  return val.replace(/^['"]|['"]$/g, '');
                });

                // For debugging
                if (successCount === 0) {
                  console.log('Cleaned values:', cleanValues);
                }

                // Use parameterized query for safety
                const sql = `INSERT INTO \`shahr\` 
                  (\`id\`, \`name\`, \`shahr_type\`, \`ostan_id\`, \`shahrestan_id\`, \`bakhsh_id\`, \`amar_code\`) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)`;

                const params = [
                  cleanValues[0], // id
                  cleanValues[1], // name
                  cleanValues[2] || '0', // shahr_type
                  cleanValues[3] || null, // ostan_id
                  cleanValues[4] || null, // shahrestan_id
                  cleanValues[5] || null, // bakhsh_id
                  cleanValues[6] || null, // amar_code
                ];

                if (successCount === 0) {
                  console.log('SQL:', sql);
                  console.log('Params:', params);
                }

                await connection.execute(sql, params);
                successCount++;

                if (successCount % 100 === 0) {
                  console.log(
                    `Imported ${successCount}/${shahrInserts.length} shahr records`,
                  );
                }
              }
            } catch (error) {
              errorCount++;
              if (errorCount <= 5) {
                console.warn(
                  `Error executing shahr statement: ${error.message}`,
                );
              }
            }
          }

          console.log(
            `Completed shahr import: ${successCount} successful, ${errorCount} errors`,
          );
        }

        continue; // Skip the regular processing for shahr
      }

      // Regular handling for other tables
      const tableInserts = allInsertStatements.filter((stmt) => {
        const upperStmt = stmt.toUpperCase();
        return (
          upperStmt.includes(`INSERT INTO \`${table.toUpperCase()}\``) ||
          upperStmt.includes(`INSERT INTO ${table.toUpperCase()}`)
        );
      });

      console.log(
        `Inserting ${tableInserts.length} rows into ${table} table...`,
      );

      if (tableInserts.length > 0) {
        for (const statement of tableInserts) {
          try {
            await connection.execute(statement);
          } catch (error) {
            console.warn(
              `Error executing statement for ${table}: ${error.message}`,
            );
            console.warn(
              `Problem statement: ${statement.substring(0, 100)}...`,
            );
          }
        }

        console.log(`Completed inserts for ${table} table`);
      }
    }

    console.log('All INSERT statements executed in correct order.');
  } finally {
    await connection.end();
  }
}

async function main() {
  try {
    console.log('Starting Iran cities data import...');

    // Path to the SQL file
    const sqlFilePath = path.resolve(__dirname, './iran_cities_v3.sql');

    // Parse the SQL file
    const statements = await parseSQLFile(sqlFilePath);

    // Execute the raw SQL statements
    await executeRawSQL(statements);

    console.log('Iran cities data import completed successfully!');
  } catch (error) {
    console.error('Error importing Iran cities data:', error);
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
