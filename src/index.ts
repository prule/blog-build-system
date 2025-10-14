import { readFileSync } from 'fs';
import { join } from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Define the shape of our build configuration
interface BuildConfiguration {
    posts: string;
    output: string;
}

console.log('Build configuration');

// Set up yargs to parse command-line arguments
const argv = yargs(hideBin(process.argv))
    .option('base-dir', {
        alias: 'b',
        type: 'string',
        description: 'Base directory for the build',
        default: process.cwd(),
    })
    .parseSync();

try {
    // Construct the absolute path to the configuration file
    const configPath = join(argv['base-dir'], 'build-configuration.json');

    // Read the file's contents into a string
    const configFile = readFileSync(configPath, 'utf-8');

    // Parse the JSON string into a JavaScript object with our defined type
    const config: BuildConfiguration = JSON.parse(configFile);

    console.log('Successfully loaded configuration:', config);
} catch (error) {
    console.error('Error reading or parsing build-configuration.json:', error);
    process.exit(1); // Exit with an error code
}
