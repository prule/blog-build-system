import { readdirSync, statSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join, basename, dirname, relative } from 'path';
import * as showdown from 'showdown';
import asciidoctor, {Asciidoctor} from "asciidoctor";
import { deflateSync } from 'zlib';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const kroki = require('asciidoctor-kroki');

interface Metadata {
    title: string;
    subTitle: string;
    date: string;
    modifiedDate: string;
    series: string;
    tags: string[];
    image?: string;
}

interface ArticleIndexData {
    title: string;
    summary: string;
    modifiedDate: string;
    tags: string[];
    path: string;
    image?: string;
    series?: string;
}

export class ArticleProcessor implements Processor {
    private readonly path: string;
    private readonly dist: string;
    private readonly name: string;
    private readonly asciidoctor: Asciidoctor;
    private articlesForIndex: ArticleIndexData[] = [];

    constructor(path: string, dist: string, name:string) {
        this.path = path;
        this.dist = dist;
        this.name = name;
        this.asciidoctor = asciidoctor();
        kroki.register(this.asciidoctor.Extensions);
    }

    run() {
        this.transform();
        this.writeIndex();
    }

    /**
     * Transforms all ReadMe.md and ReadMe.adoc files in the dist folder to HTML files called ReadMe.html
     */
    transform() {
        console.log(`Transforming ${this.name}...`);

        const mermaidShowdownExtension = {
            type: 'output' as const,
            regex: /<pre><code class="mermaid language-mermaid">([\s\S]+?)<\/code><\/pre>/g,
            replace: (_: string, mermaidCode: string): string => {
                const unescapedCode = mermaidCode.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
                const compressed = deflateSync(unescapedCode);
                const encoded = compressed.toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
                const krokiUrl = `https://kroki.io/mermaid/svg/${encoded}`;
                return `<img src="${krokiUrl}" alt="Mermaid diagram"/>`;
            }
        };

        const youtubeShowdownExtension = {
            type: 'output' as const,
            regex: /<p><a href="https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([-\w]+)">https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[-\w]+<\/a><\/p>/g,
            replace: (match: string, videoId: string): string => {
                return `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; height: auto;">
                    <iframe 
                        src="https://www.youtube.com/embed/${videoId}" 
                        frameborder="0" 
                        allowfullscreen 
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                    </iframe>
                </div>`;
            }
        };

        const markdownConverter = new showdown.Converter({ extensions: [mermaidShowdownExtension, youtubeShowdownExtension] });

        this.findAndTransform(this.dist, file => {
            if (basename(file) === 'ReadMe.md' || basename(file) === 'ReadMe.adoc') {
                console.log(`Transforming ${file}`);
                const content = readFileSync(file, 'utf-8');
                let html: string;

                if (basename(file) === 'ReadMe.md') {
                    // youtube is handled via the plugin
                    html = markdownConverter.makeHtml(content);
                } else {
                    const options = { safe: 'safe', base_dir: dirname(file) };
                    html = this.asciidoctor.convert(content, options) as string;
                    html = html.replace(/<div class="paragraph">\n<p><a href="https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([-\w]+)" class="bare">https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[-\w]+<\/a><\/p>\n<\/div>/g, (match: string, videoId: string): string => {
                        return `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; height: auto;">
                                    <iframe 
                                        src="https://www.youtube.com/embed/${videoId}" 
                                        frameborder="0" 
                                        allowfullscreen 
                                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                                    </iframe>
                                </div>`;
                    });
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
                        path: articlePath,
                        image: metadata.image,
                        series: metadata.series
                    });
                } catch (error) {
                    console.error(`Error processing metadata for ${file}:`, error);
                }
            }
        });
        console.log('Article transformation complete.');
    }

    private writeIndex() {
        const articlesJsonPath = join(this.dist, `${this.name}.json`);
        console.log(`Writing article index... ${articlesJsonPath}`);
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
