const { sequelize } = require('../database/models');

async function resetDatabase() {
  try {
    console.log('⚠️ Dropping public schema (development only)...');
    await sequelize.query('DROP SCHEMA public CASCADE;');
    await sequelize.query('CREATE SCHEMA public;');
    await sequelize.query("GRANT ALL ON SCHEMA public TO public;");
    await sequelize.query("COMMENT ON SCHEMA public IS 'standard public schema';");
    console.log('✅ Schema reset complete');
  } catch (err) {
    console.error('❌ Failed to reset schema:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  resetDatabase().then(() => process.exit(0));
}

module.exports = resetDatabase; 