import dataSource from '../data-source.js';

async function run() {
  await dataSource.initialize();
  await dataSource.runMigrations();
  console.log('Migrations done.');
  await dataSource.destroy();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
