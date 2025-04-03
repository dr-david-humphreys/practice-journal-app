import { sequelize } from '../models/db';
import { QueryTypes } from 'sequelize';
import { SchoolLevel, ProgramType } from '../models/settings.model';

/**
 * This script adds the new school customization fields to the existing school_settings table
 * Run this script with: npx ts-node src/scripts/migrate-settings.ts
 */
async function migrateSchoolSettings() {
  try {
    console.log('Starting migration of school_settings table...');
    
    // Check if the table exists
    const tables = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='school_settings'",
      { type: QueryTypes.SELECT }
    );
    
    if (tables.length === 0) {
      console.log('school_settings table does not exist. No migration needed.');
      return;
    }
    
    // Check if the columns already exist
    const tableInfo = await sequelize.query(
      "PRAGMA table_info(school_settings)",
      { type: QueryTypes.SELECT }
    );
    
    const columnNames = tableInfo.map((column: any) => column.name);
    
    // Add schoolName column if it doesn't exist
    if (!columnNames.includes('schoolName')) {
      await sequelize.query(
        "ALTER TABLE school_settings ADD COLUMN schoolName TEXT DEFAULT 'My School' NOT NULL",
        { type: QueryTypes.RAW }
      );
      console.log('Added schoolName column');
    }
    
    // Add schoolLevel column if it doesn't exist
    if (!columnNames.includes('schoolLevel')) {
      await sequelize.query(
        `ALTER TABLE school_settings ADD COLUMN schoolLevel TEXT DEFAULT '${SchoolLevel.HIGH_SCHOOL}' NOT NULL`,
        { type: QueryTypes.RAW }
      );
      console.log('Added schoolLevel column');
    }
    
    // Add programType column if it doesn't exist
    if (!columnNames.includes('programType')) {
      await sequelize.query(
        `ALTER TABLE school_settings ADD COLUMN programType TEXT DEFAULT '${ProgramType.BAND}' NOT NULL`,
        { type: QueryTypes.RAW }
      );
      console.log('Added programType column');
    }
    
    // Add customSchoolLevel column if it doesn't exist
    if (!columnNames.includes('customSchoolLevel')) {
      await sequelize.query(
        "ALTER TABLE school_settings ADD COLUMN customSchoolLevel TEXT",
        { type: QueryTypes.RAW }
      );
      console.log('Added customSchoolLevel column');
    }
    
    // Add customProgramType column if it doesn't exist
    if (!columnNames.includes('customProgramType')) {
      await sequelize.query(
        "ALTER TABLE school_settings ADD COLUMN customProgramType TEXT",
        { type: QueryTypes.RAW }
      );
      console.log('Added customProgramType column');
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the migration
migrateSchoolSettings();
