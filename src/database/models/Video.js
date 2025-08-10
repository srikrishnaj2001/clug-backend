module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define('Video', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    url: { type: DataTypes.STRING, allowNull: true },
    transcript: { type: DataTypes.TEXT, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, { tableName: 'videos', timestamps: true, defaultScope: { attributes: { exclude: ['createdAt', 'updatedAt'] } } });
  return Video;
}; 