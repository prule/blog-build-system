import { readFileSync } from 'fs';
import { join, resolve } from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { ContentProcessor } from './ContentProcessor';
import {ThemeProcessor} from "./theme";
import {ArticleProcessor} from "./ArticleProcessor";
import {NotesProcessor} from "./NotesProcessor";

/**
 * Build configuration looks like this:
 * {
 *   "content": "./content",
 *   "theme": "./theme",
 *   "dist": "./dist"
 * }
 */
interface BuildConfiguration {
    content: string;
    theme: string;
    dist: string;
}

console.log('Build configuration');

// Set up yargs to parse command-line arguments
const argv = yargs(hideBin(process.argv))
    .option('base', {
        alias: 'b',
        type: 'string',
        description: 'Base directory for the site configuration',
        default: process.cwd(),
    })
    .parseSync();

function loadBuildConfiguration(baseDir: string) {
    // Construct the absolute path to the configuration file
    const configPath = join(baseDir, 'build-configuration.json');

    // Read the file's contents into a string
    const configFile = readFileSync(configPath, 'utf-8');

    // Parse the JSON string into a JavaScript object with our defined type
    const config: BuildConfiguration = JSON.parse(configFile);
    return config;
}

function loadSiteConfiguration(baseDir: string) {
    // Construct the absolute path to the configuration file
    const configPath = join(baseDir, 'site.json');

    // Read the file's contents into a string
    const configFile = readFileSync(configPath, 'utf-8');

    // Parse the JSON string into a JavaScript object with our defined type
    const config: SiteConfiguration = JSON.parse(configFile);
    return config;
}

try {
    const baseDir = resolve(argv['base'] as string);
    console.log('Using base directory:', baseDir);
    const buildConfiguration = loadBuildConfiguration(baseDir);
    const siteConfiguration = loadSiteConfiguration(baseDir);

    console.log('Successfully loaded configuration:', buildConfiguration);

    // Process content
    const contentProcessor = new ContentProcessor(
        join(baseDir, buildConfiguration.content),
        join(baseDir, buildConfiguration.dist)
    );
    contentProcessor.run();

    const articleProcessor = new ArticleProcessor(
        join(baseDir, buildConfiguration.content, "articles"),
        join(baseDir, buildConfiguration.dist)
    )
    articleProcessor.run();

    const notesProcessor = new NotesProcessor(
        join(baseDir, buildConfiguration.content, "notes"),
        join(baseDir, buildConfiguration.dist)
    )
    notesProcessor.run();

    const themeProcessor = new ThemeProcessor(
        join(baseDir, buildConfiguration.theme),
        join(baseDir, buildConfiguration.dist),
        siteConfiguration
    )
    themeProcessor.run();
} catch (error) {
    console.error('Error reading or parsing build-configuration.json:', error);
    process.exit(1); // Exit with an error code
}
