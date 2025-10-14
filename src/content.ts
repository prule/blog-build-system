import { cpSync } from 'fs';

export class ContentProcessor {
    private readonly path: string;
    private readonly dist: string;

    constructor(path: string, dist: string) {
        this.path = path;
        this.dist = dist;
    }

    run() {
        this.copy()
        this.transformArticles()
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

    }
}
