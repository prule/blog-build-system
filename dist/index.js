"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const content_1 = require("./content");
console.log('Build configuration');
// Set up yargs to parse command-line arguments
const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .option('base', {
    alias: 'b',
    type: 'string',
    description: 'Base directory for the site configuration',
    default: process.cwd(),
})
    .parseSync();
try {
    const baseDir = (0, path_1.resolve)(argv['base']);
    console.log('Using base directory:', baseDir);
    // Construct the absolute path to the configuration file
    const configPath = (0, path_1.join)(baseDir, 'build-configuration.json');
    // Read the file's contents into a string
    const configFile = (0, fs_1.readFileSync)(configPath, 'utf-8');
    // Parse the JSON string into a JavaScript object with our defined type
    const config = JSON.parse(configFile);
    console.log('Successfully loaded configuration:', config);
    // Process content
    const contentProcessor = new content_1.ContentProcessor((0, path_1.join)(baseDir, config.content), (0, path_1.join)(baseDir, config.dist));
    contentProcessor.run();
}
catch (error) {
    console.error('Error reading or parsing build-configuration.json:', error);
    process.exit(1); // Exit with an error code
}
