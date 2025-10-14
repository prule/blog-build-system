import { cpSync, readdirSync, statSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join, extname, basename } from 'path';
import * as showdown from 'showdown';

export class ContentProcessor {
    private readonly path: string;
    private readonly dist: string;

    constructor(path: string, dist: string) {
        this.path = path;
        this.dist = dist;
    }

    run() {
        this.copy();
        this.transformArticles();
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
     * Transforms all ReadMe.md files in the dist folder to HTML files called index.html
     */
    transformArticles() {
        console.log('Transforming articles...');
        const converter = new showdown.Converter();
        this.findAndTransform(this.dist, file => {
            if (basename(file) === 'ReadMe.md') {
                console.log(`Transforming ${file}`);
                const content = readFileSync(file, 'utf-8');
                const html = converter.makeHtml(content);
                const newPath = join(file, '..', 'index.html');
                writeFileSync(newPath, html);
                unlinkSync(file);
            }
        });
        console.log('Transformation complete.');
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
