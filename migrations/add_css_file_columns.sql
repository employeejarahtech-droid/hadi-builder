-- Database Migration: Add CSS File Support
-- Generated: 2026-01-09
-- Description: Adds css_file column to store generated CSS file paths

-- Add css_file column to pages table
ALTER TABLE pages ADD COLUMN css_file VARCHAR(255) DEFAULT NULL;

-- Add css_file column to posts table
ALTER TABLE posts ADD COLUMN css_file VARCHAR(255) DEFAULT NULL;

-- Add css_file column to headers table
ALTER TABLE headers ADD COLUMN css_file VARCHAR(255) DEFAULT NULL;

-- Add css_file column to footers table
ALTER TABLE footers ADD COLUMN css_file VARCHAR(255) DEFAULT NULL;

-- Add css_file column to topbars table
ALTER TABLE topbars ADD COLUMN css_file VARCHAR(255) DEFAULT NULL;
