module.exports = (sequelize, DataTypes) => {
  const Program = sequelize.define('Program', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, { tableName: 'programs', timestamps: true, defaultScope: { attributes: { exclude: ['createdAt', 'updatedAt'] } } });
  return Program;
}; 