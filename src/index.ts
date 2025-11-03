import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import {SiteProcessor} from "./SiteProcessor";
import {readFileSync} from 'fs';
import {join, resolve} from 'path';
import {LaunchProcessor} from "./LaunchProcessor";

/**
 * ```json5
 * {
 *   "includeLaunchPage": true,
 *   "sites": [
 *     {
 *       "path": "programming"
 *     }
 *   ]
 * }
 * ```
 */
export interface SitesConfiguration {
    includeLaunchPage: string;
    sites: Array<SiteConfiguration>;
}

export interface SiteConfiguration {
    path: string,
    image: string
}

// Set up yargs to parse command-line arguments
const argv = yargs(hideBin(process.argv))
    .option('base', {
        alias: 'b',
        type: 'string',
        description: 'Base directory for the site configuration',
        default: process.cwd(),
    })
    .parseSync();

const baseDir = resolve(argv['base'] as string);
console.log('Using base directory:', baseDir);

// read baseDir/sites.json to find all the sites to process

function loadSitesConfiguration(baseDir: string) {
    // Construct the absolute path to the configuration file
    const configPath = join(baseDir, 'sites.json');

    // Read the file's contents into a string
    const configFile = readFileSync(configPath, 'utf-8');

    // Parse the JSON string into a JavaScript object with our defined type
    const config: SitesConfiguration = JSON.parse(configFile);
    return config;
}

const sitesConfiguration = loadSitesConfiguration(baseDir);

sitesConfiguration.sites.forEach(site => {
    console.log('Processing site:', site);
    new SiteProcessor().run(join(baseDir, site.path), "/"+site.path);
});

new LaunchProcessor(join(baseDir, "theme"), join(baseDir, "dist"), sitesConfiguration).run()
