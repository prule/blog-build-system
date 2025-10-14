import { readdirSync, statSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';

interface Metadata {
    title: string;
    subTitle: string;
    date: string;
    modifiedDate: string;
    series: string;
    tags: string[];
}

export class ThemeProcessor {
    private readonly theme: string;
    private readonly dist: string;

    constructor(theme: string, dist: string) {
        this.theme = theme;
        this.dist = dist;
    }

    /**
     * Finds all the ReadMe.html files in the dist/articles folder.
     * Then, it loads the metadata.json beside it.
     * These values and the content of the ReadMe.html file are
     * then injected into the article template file to produce index.html.
     */
    processArticles() {
        console.log('Theming articles...');
        const articleTemplatePath = join(this.theme, 'article.html');
        const articleTemplate = readFileSync(articleTemplatePath, 'utf-8');

        this.findAndProcess(join(this.dist, 'articles'), file => {
            if (file.endsWith('ReadMe.html')) {
                const metadataPath = join(dirname(file), 'metadata.json');
                try {
                    const metadata: Metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));
                    const articleContent = readFileSync(file, 'utf-8');

                    console.log(`Theming ${metadata.title}`);

                    const output = articleTemplate
                        .replace(/{{ARTICLE_TITLE}}/g, metadata.title)
                        .replace(/{{subTitle}}/g, metadata.subTitle)
                        .replace(/{{ARTICLE_DATE}}/g, new Date(metadata.date).toDateString())
                        .replace(/{{modifiedDate}}/g, new Date(metadata.modifiedDate).toDateString())
                        .replace(/{{series}}/g, metadata.series)
                        .replace(/{{TAGS}}/g, metadata.tags.join(', '))
                        .replace(/{{ARTICLE_CONTENT}}/g, articleContent);

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
