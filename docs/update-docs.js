#!/usr/bin/env node

/**
 * Documentation Update Script
 * 
 * This script helps you quickly add entries to the documentation CSV files
 * Usage: node update-docs.js [type] [component] [description] [files]
 * 
 * Example: node update-docs.js change Sidebar "Added dark mode toggle" "src/components/Sidebar.tsx"
 */

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname);
const TODAY = new Date().toISOString().split('T')[0];

// Get command line arguments
const args = process.argv.slice(2);
const [type, component, description, files, developer = 'Developer'] = args;

if (!type || !component || !description) {
    console.log(`
📝 Documentation Update Script

Usage: node update-docs.js [type] [component] [description] [files] [developer]

Types:
  - change    : Add to CHANGE_LOG.csv
  - task      : Add to DEVELOPMENT_TASKS.csv
  - component : Add to COMPONENT_INVENTORY.csv
  - api       : Add to API_ENDPOINTS.csv

Examples:
  node update-docs.js change Sidebar "Added dark mode toggle" "src/components/Sidebar.tsx" "John Doe"
  node update-docs.js task "Implement Authentication" "Add login functionality" "" "Jane Smith"
  node update-docs.js component NewComponent "src/components/NewComponent.tsx" "New feature component" "react"
    `);
    process.exit(1);
}

function addChangeLogEntry() {
    const filePath = path.join(DOCS_DIR, 'CHANGE_LOG.csv');
    const entry = `${TODAY},${component},Enhancement,${description},${files || ''},${developer},Medium,Completed\n`;
    
    fs.appendFileSync(filePath, entry);
    console.log(`✅ Added change log entry: ${component} - ${description}`);
}

function addTaskEntry() {
    const filePath = path.join(DOCS_DIR, 'DEVELOPMENT_TASKS.csv');
    const taskId = `TASK-${Date.now().toString().slice(-6)}`;
    const entry = `${taskId},${component},${description},Medium,Pending,${developer},${TODAY},,,\n`;
    
    fs.appendFileSync(filePath, entry);
    console.log(`✅ Added task entry: ${taskId} - ${component}`);
}

function addComponentEntry() {
    const filePath = path.join(DOCS_DIR, 'COMPONENT_INVENTORY.csv');
    const entry = `${component},${description},React Component,${files || 'Component description'},react,Active,${TODAY},${developer}\n`;
    
    fs.appendFileSync(filePath, entry);
    console.log(`✅ Added component entry: ${component}`);
}

function addApiEntry() {
    const filePath = path.join(DOCS_DIR, 'API_ENDPOINTS.csv');
    const entry = `${component},GET,${description},${files || 'API description'},,JSON,Planned,${TODAY},${developer}\n`;
    
    fs.appendFileSync(filePath, entry);
    console.log(`✅ Added API entry: ${component}`);
}

// Route to appropriate function based on type
switch (type.toLowerCase()) {
    case 'change':
        addChangeLogEntry();
        break;
    case 'task':
        addTaskEntry();
        break;
    case 'component':
        addComponentEntry();
        break;
    case 'api':
        addApiEntry();
        break;
    default:
        console.error(`❌ Unknown type: ${type}`);
        console.log('Available types: change, task, component, api');
        process.exit(1);
}

console.log(`\n📊 Documentation updated successfully!`);
console.log(`📁 Files are ready for import to Google Sheets`);
console.log(`📅 Date: ${TODAY}`); 