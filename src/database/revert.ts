import dataSource from '../data-source.js';

async function run() {
  await dataSource.initialize();
  await dataSource.undoLastMigration();
  console.log('Last migration reverted.');
  await dataSource.destroy();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
