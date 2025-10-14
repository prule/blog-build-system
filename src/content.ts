import { cpSync, readdirSync, statSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join, basename } from 'path';
import * as showdown from 'showdown';
import asciidoctor, {Asciidoctor} from "asciidoctor";

export class ContentProcessor {
    private readonly path: string;
    private readonly dist: string;
    private readonly asciidoctor: Asciidoctor;

    constructor(path: string, dist: string) {
        this.path = path;
        this.dist = dist;
        this.asciidoctor = asciidoctor();
    }

    run() {
        this.copy();
        this.transformArticlesMarkdown();
        this.transformArticlesAsciiDoctor();
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
     * Transforms all ReadMe.md files in the dist folder to HTML files called ReadMe.html
     */
    transformArticlesMarkdown() {
        console.log('Transforming Markdown articles...');
        const converter = new showdown.Converter();
        this.findAndTransform(this.dist, file => {
            if (basename(file) === 'ReadMe.md') {
                console.log(`Transforming ${file}`);
                const content = readFileSync(file, 'utf-8');
                const html = converter.makeHtml(content);
                const newPath = join(file, '..', 'ReadMe.html');
                writeFileSync(newPath, html);
            }
        });
        console.log('Markdown transformation complete.');
    }

    /**
     * Transforms all ReadMe.adoc files in the dist folder to HTML files called ReadMe.html
     */
    transformArticlesAsciiDoctor() {
        console.log('Transforming AsciiDoc articles...');
        this.findAndTransform(this.dist, file => {
            if (basename(file) === 'ReadMe.adoc') {
                console.log(`Transforming ${file}`);
                const content = readFileSync(file, 'utf-8');
                const html = this.asciidoctor.convert(content);
                const newPath = join(file, '..', 'ReadMe.html');
                writeFileSync(newPath, html as string);
            }
        });
        console.log('AsciiDoc transformation complete.');
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
