import {readFileSync} from 'fs';
import {join, resolve} from 'path';
import {ContentProcessor} from './ContentProcessor';
import {ThemeProcessor} from "./ThemeProcessor";
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

export class SiteProcessor {

    loadBuildConfiguration(baseDir: string) {
        // Construct the absolute path to the configuration file
        const configPath = join(baseDir, 'build-configuration.json');

        // Read the file's contents into a string
        const configFile = readFileSync(configPath, 'utf-8');

        // Parse the JSON string into a JavaScript object with our defined type
        const config: BuildConfiguration = JSON.parse(configFile);
        return config;
    }

    loadSiteConfiguration(baseDir: string) {
        // Construct the absolute path to the configuration file
        const configPath = join(baseDir, 'site.json');

        // Read the file's contents into a string
        const configFile = readFileSync(configPath, 'utf-8');

        // Parse the JSON string into a JavaScript object with our defined type
        const config: SiteConfiguration = JSON.parse(configFile);
        return config;
    }

    run(baseDir: string, base: string) {
        try {
            console.log('Using base directory:', baseDir);
            const buildConfiguration = this.loadBuildConfiguration(baseDir);
            const siteConfiguration = this.loadSiteConfiguration(baseDir);

            console.log('Successfully loaded configuration:', buildConfiguration);

            // Process content
            const processors: Processor[] = [
                    new ContentProcessor(
                        join(baseDir, buildConfiguration.content),
                        join(baseDir, buildConfiguration.dist)
                    ),
                    new ArticleProcessor(
                        join(baseDir, buildConfiguration.content, "articles"),
                        join(baseDir, buildConfiguration.dist)
                    ),
                    new NotesProcessor(
                        join(baseDir, buildConfiguration.content, "notes"),
                        join(baseDir, buildConfiguration.dist)
                    ),
                    new ThemeProcessor(
                        join(baseDir, buildConfiguration.theme),
                        join(baseDir, buildConfiguration.dist),
                        siteConfiguration,
                        base
                    )
                ]

            processors.forEach(processor => processor.run());
        } catch
            (error) {
            console.error('Error reading or parsing build-configuration.json:', error);
            process.exit(1); // Exit with an error code
        }
    }
}
