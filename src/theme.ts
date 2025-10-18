import { readdirSync, statSync, readFileSync, writeFileSync, cpSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import * as Mustache from 'mustache';

interface Metadata {
    title: string;
    subTitle: string;
    date: string;
    modifiedDate: string;
    series: string;
    tags: string[];
}

interface ArticleIndexData {
    title: string;
    summary: string;
    modifiedDate: string;
    tags: string[];
    path: string;
}

export class ThemeProcessor {
    private readonly theme: string;
    private readonly dist: string;
    private readonly siteConfiguration: SiteConfiguration;

    constructor(theme: string, dist: string, siteConfiguration: SiteConfiguration) {
        this.theme = theme;
        this.dist = dist;
        this.siteConfiguration = siteConfiguration;
    }

    /**
     * Copies theme/assets to dist/assets (recursively)
     */
    copyAssets() {
        console.log('Copying theme assets...');
        const source = join(this.theme, 'assets');
        const destination = join(this.dist, 'assets');

        if (existsSync(source)) {
            cpSync(source, destination, { recursive: true });
            console.log('Theme assets copied successfully.');
        } else {
            console.log('No theme assets directory found to copy.');
        }
    }

    /**
     * Uses the article.json data file to pass a list of all articles to the article-archive template.
     */
    processArticleArchive() {
        console.log('Processing article archive...');
        const articlesJsonPath = join(this.dist, 'articles.json');
        if (!existsSync(articlesJsonPath)) {
            console.log('articles.json not found, skipping article archive processing.');
            return;
        }

        const articles: ArticleIndexData[] = JSON.parse(readFileSync(articlesJsonPath, 'utf-8'));
        const allTags = [...new Set(articles.flatMap(article => article.tags))];

        const archiveTemplatePath = join(this.theme, 'article-archive.html');
        const archiveTemplate = readFileSync(archiveTemplatePath, 'utf-8');

        const headTemplatePath = join(this.theme, 'head.html');
        const headTemplate = readFileSync(headTemplatePath, 'utf-8');

        const headerTemplatePath = join(this.theme, 'header.html');
        const headerTemplate = readFileSync(headerTemplatePath, 'utf-8');

        const footerTemplatePath = join(this.theme, 'footer.html');
        const footerTemplate = readFileSync(footerTemplatePath, 'utf-8');

        const partials = {
            head: headTemplate,
            header: headerTemplate,
            footer: footerTemplate
        };

        const view = {
            site: this.siteConfiguration,
            articles: articles.map(article => ({
                ...article,
                modifiedDate: new Date(article.modifiedDate).toDateString(),
                tagsJson: JSON.stringify(article.tags) // Pass tags as a JSON string for client-side filtering
            })),
            tags: allTags
        };

        const output = Mustache.render(archiveTemplate, view, partials);
        const archiveDir = join(this.dist, 'articles');
        if (!existsSync(archiveDir)) {
            mkdirSync(archiveDir, { recursive: true });
        }
        const outputPath = join(archiveDir, 'archive.html');
        writeFileSync(outputPath, output);

        console.log('Article archive processed successfully.');
    }

    /**
     * Uses the article.json data file to pass a list of the most recent articles to the index template.
     */
    processHomePage() {
        console.log('Processing home page...');
        const articlesJsonPath = join(this.dist, 'articles.json');
        if (!existsSync(articlesJsonPath)) {
            console.log('articles.json not found, skipping home page processing.');
            return;
        }

        const articles: ArticleIndexData[] = JSON.parse(readFileSync(articlesJsonPath, 'utf-8'));

        // Sort articles by date and take the most recent 10
        const recentArticles = articles
            .sort((a, b) => new Date(b.modifiedDate).getTime() - new Date(a.modifiedDate).getTime())
            .slice(0, 10)
            .map(article => ({
                ...article,
                // Format the date for display
                modifiedDate: new Date(article.modifiedDate).toDateString()
            }));

        const indexTemplatePath = join(this.theme, 'index.html');
        const indexTemplate = readFileSync(indexTemplatePath, 'utf-8');

        const headTemplatePath = join(this.theme, 'head.html');
        const headTemplate = readFileSync(headTemplatePath, 'utf-8');

        const headerTemplatePath = join(this.theme, 'header.html');
        const headerTemplate = readFileSync(headerTemplatePath, 'utf-8');

        const footerTemplatePath = join(this.theme, 'footer.html');
        const footerTemplate = readFileSync(footerTemplatePath, 'utf-8');

        const partials = {
            head: headTemplate,
            header: headerTemplate,
            footer: footerTemplate
        };

        const view = {
            site: this.siteConfiguration,
            articles: recentArticles
        };

        const output = Mustache.render(indexTemplate, view, partials);
        const outputPath = join(this.dist, 'index.html');
        writeFileSync(outputPath, output);

        console.log('Home page processed successfully.');
    }

    /**
     * Finds all the ReadMe.html files in the dist/articles folder.
     * Then, it loads the metadata.json beside it.
     * These values and the content of the ReadMe.html file are
     * then injected into the article template file to produce index.html.
     * It does not delete any files, but leaves them there for reference.
     */
    processArticles() {
        console.log('Theming articles...');
        const articleTemplatePath = join(this.theme, 'article.html');
        const articleTemplate = readFileSync(articleTemplatePath, 'utf-8');

        const headTemplatePath = join(this.theme, 'head.html');
        const headTemplate = readFileSync(headTemplatePath, 'utf-8');

        const headerTemplatePath = join(this.theme, 'header.html');
        const headerTemplate = readFileSync(headerTemplatePath, 'utf-8');

        const footerTemplatePath = join(this.theme, 'footer.html');
        const footerTemplate = readFileSync(footerTemplatePath, 'utf-8');

        const partials = {
            head: headTemplate,
            header: headerTemplate,
            footer: footerTemplate
        };

        this.findAndProcess(join(this.dist, 'articles'), file => {
            if (file.endsWith('ReadMe.html')) {
                const metadataPath = join(dirname(file), 'metadata.json');
                try {
                    const metadata: Metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));
                    const articleContent = readFileSync(file, 'utf-8');


                    const view = {
                        meta: metadata,
                        site: this.siteConfiguration,
                        date: new Date(metadata.date).toDateString(),
                        modifiedDate: new Date(metadata.modifiedDate).toDateString(),
                        content: articleContent
                    };
                    console.log(`Theming ${view.meta.title}`);

                    const output = Mustache.render(articleTemplate, view, partials);

                    const newPath = join(dirname(file), 'index.html');
                    writeFileSync(newPath, output);
                } catch (error) {
                    console.error(`Error processing ${file}:`, error);
                }
            }
        });
        console.log('Article theming complete.');
    }

    private findAndProcess(dir: string, callback: (file: string) => void) {
        try {
            const files = readdirSync(dir);
            for (const file of files) {
                const fullPath = join(dir, file);
                if (statSync(fullPath).isDirectory()) {
                    this.findAndProcess(fullPath, callback);
                } else {
                    callback(fullPath);
                }
            }
        } catch (error) {
            // @ts-ignore
            if (error.code === 'ENOENT') {
                // The directory doesn't exist, which is fine.
                return;
            }
            throw error;
        }
    }
}
