import { cpSync, readdirSync, statSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join, basename, dirname, relative } from 'path';
import * as showdown from 'showdown';
import asciidoctor, {Asciidoctor} from "asciidoctor";

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

export class ContentProcessor {
    private readonly path: string;
    private readonly dist: string;
    private readonly asciidoctor: Asciidoctor;
    private articlesForIndex: ArticleIndexData[] = [];

    constructor(path: string, dist: string) {
        this.path = path;
        this.dist = dist;
        this.asciidoctor = asciidoctor();
    }

    run() {
        this.copy();
        this.transformArticles();
        this.writeIndex();
    }

    /**
     * Copies the content to the dist folder
     */
    copy() {
        console.log(`Copying files from ${this.path} to ${this.dist}`);
        cpSync(this.path, this.dist, { recursive: true });
        console.log('Copy complete.');
    }

    /**
     * Transforms all ReadMe.md and ReadMe.adoc files in the dist folder to HTML files called ReadMe.html
     */
    transformArticles() {
        console.log('Transforming articles...');
        const markdownConverter = new showdown.Converter();

        this.findAndTransform(this.dist, file => {
            if (basename(file) === 'ReadMe.md' || basename(file) === 'ReadMe.adoc') {
                console.log(`Transforming ${file}`);
                const content = readFileSync(file, 'utf-8');
                let html: string;

                if (basename(file) === 'ReadMe.md') {
                    html = markdownConverter.makeHtml(content);
                } else {
                    const options = { safe: 'safe', base_dir: dirname(file) };
                    html = this.asciidoctor.convert(content, options) as string;
                }

                const newPath = join(dirname(file), 'ReadMe.html');
                writeFileSync(newPath, html);
                unlinkSync(file);

                // Extract metadata and add to index
                const metadataPath = join(dirname(file), 'metadata.json');
                try {
                    const metadata: Metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));
                    const summaryMatch = html.match(/<p>(.*?)<\/p>/);
                    const summary = summaryMatch ? summaryMatch[1].replace(/<[^>]*>/g, '') : '';
                    const articlePath = join('/', relative(this.dist, dirname(file)), 'index.html');

                    this.articlesForIndex.push({
                        title: metadata.title,
                        modifiedDate: metadata.modifiedDate,
                        tags: metadata.tags,
                        summary: summary,
                        path: articlePath
                    });
                } catch (error) {
                    console.error(`Error processing metadata for ${file}:`, error);
                }
            }
        });
        console.log('Article transformation complete.');
    }

    private writeIndex() {
        console.log('Writing article index...');
        const articlesJsonPath = join(this.dist, 'articles.json');
        writeFileSync(articlesJsonPath, JSON.stringify(this.articlesForIndex, null, 2));
        console.log('Article index written successfully.');
    }

    private findAndTransform(dir: string, callback: (file: string) => void) {
        const files = readdirSync(dir);
        for (const file of files) {
            const fullPath = join(dir, file);
            if (statSync(fullPath).isDirectory()) {
                this.findAndTransform(fullPath, callback);
            } else {
                callback(fullPath);
            }
        }
    }
}
