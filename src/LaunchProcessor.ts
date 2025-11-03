import {join} from "path";
import {readFileSync, writeFileSync} from "fs";
import {SitesConfiguration} from "./index";
import Mustache from "mustache";


export class LaunchProcessor implements Processor {
    private readonly theme: string;
    private readonly dist: string;
    private readonly sitesConfiguration: SitesConfiguration;

    constructor(theme: string, dist: string, sitesConfiguration: SitesConfiguration) {
        this.theme = theme;
        this.dist = dist;
        this.sitesConfiguration = sitesConfiguration;
    }

    run() {
        console.log('Processing launch page...');
        const launchPageTemplatePath = join(this.theme, 'launch-page.hbs');
        const launchPageTemplate = readFileSync(launchPageTemplatePath, 'utf-8');

        const view = {
            sites: this.sitesConfiguration.sites
        };

        const output = Mustache.render(launchPageTemplate, view);
        const outputPath = join(this.dist, 'index.html');
        writeFileSync(outputPath, output);

        console.log('Launch page processed successfully.');
    }

}
