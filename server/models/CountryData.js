const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CountryData = sequelize.define('CountryData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  year_2000: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  year_2001: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  year_2002: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  year_2003: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  year_2004: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  year_2005: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  year_2006: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  year_2007: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  year_2008: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  year_2009: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  year_2010: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  year_2011: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  year_2012: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  tableName: 'country_data',
  indexes: [
    {
      fields: ['country']
    }
  ]
});

module.exports = CountryData;
