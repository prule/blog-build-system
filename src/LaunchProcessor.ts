import {join} from "path";
import {cpSync, readFileSync, writeFileSync} from "fs";
import {SitesConfiguration} from "./index";
import Mustache from "mustache";


export class LaunchProcessor implements Processor {
    private readonly theme: string;
    private readonly dist: string;
    private readonly base: string;
    private readonly sitesConfiguration: SitesConfiguration;

    constructor(theme: string, dist: string, sitesConfiguration: SitesConfiguration, base: string) {
        this.theme = theme;
        this.dist = dist;
        this.base = base;
        this.sitesConfiguration = sitesConfiguration;
    }

    run() {
        console.log('Processing launch page...');
        const launchPageTemplatePath = join(this.theme, 'launch-page.html');
        const launchPageTemplate = readFileSync(launchPageTemplatePath, 'utf-8');



        const view = {
            sites: this.sitesConfiguration.sites.map(site => {
                let siteConfiguration = JSON.parse(readFileSync(join(this.base, site.path, 'site.json'), 'utf-8'));
                console.log(`Site configuration: ${JSON.stringify(siteConfiguration, null, 2)}`);
                return {
                    path: site.path,
                    image: site.image,
                    ...siteConfiguration
                }
            })
        };

        const output = Mustache.render(launchPageTemplate, view);
        const outputPath = join(this.dist, 'index.html');
        writeFileSync(outputPath, output);

        cpSync(join(this.theme, "assets"), join(this.dist,"assets"), { recursive: true });

        console.log('Launch page processed successfully.');
    }

}
