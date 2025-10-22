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

export class ContentProcessor {
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
