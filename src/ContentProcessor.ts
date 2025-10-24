import { cpSync } from 'fs';

export class ContentProcessor implements Processor {
    private readonly path: string;
    private readonly dist: string;

    constructor(path: string, dist: string) {
        this.path = path;
        this.dist = dist;
    }

    run() {
        this.copy();
    }

    /**
     * Copies the content to the dist folder
     */
    copy() {
        console.log(`Copying files from ${this.path} to ${this.dist}`);
        cpSync(this.path, this.dist, { recursive: true });
        console.log('Copy complete.');
    }

}
