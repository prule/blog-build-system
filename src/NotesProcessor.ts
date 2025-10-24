import showdown from "showdown";
import * as fs from "fs";
import * as path from "path";

interface Metadata {
    content: string;
    date: string;
    modifiedDate: string;
}

interface NotesIndexData {
    content: string;
    modifiedDate: string;
    path: string;
}

export class NotesProcessor implements Processor {
    private readonly path: string;
    private readonly dist: string;

    private notesForIndex: NotesIndexData[] = [];
    private markdownConverter = new showdown.Converter();

    constructor(path: string, dist: string) {
        this.path = path;
        this.dist = dist;
    }

    run() {
        this.transform();
        this.writeIndex();
    }

    /**
     * Parses all the markdown files in the dist folder - each markdown file might have multiple notes, separated
     * by ---- and beginning with the date on one line and then followed by the content on subsequent lines.
     * Each note is pushed to the notesForIndex array.
     */
    transform() {
        console.log('Transforming notes in ...', this.path)
        const files = fs.readdirSync(this.path);
        files.forEach(file => {
            if (path.extname(file) === '.md') {
                console.log('Transforming note in ...', file)
                const filePath = path.join(this.path, file);
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const notes = fileContent.split('----');

                notes.forEach((noteContent, index) => {
                    const trimmedContent = noteContent.trim();
                    if (trimmedContent === '') return;

                    const lines = trimmedContent.split(/\r?\n/);
                    const date = lines.shift();
                    const content = lines.join('\n').trim();

                    if (!date || !content) return;

                    const htmlContent = this.markdownConverter.makeHtml(content);
                    const noteId = `${path.basename(file, '.md')}-${index}`;

                    this.notesForIndex.push({
                        content: htmlContent,
                        modifiedDate: new Date(date).toISOString(),
                        path: `/notes/${noteId}.html`,
                    });
                });
            }
        });
    }

    /**
     * Writes the notesForIndex array to a JSON file in the dist folder
     */
    writeIndex() {
        if (!fs.existsSync(this.dist)) {
            fs.mkdirSync(this.dist, { recursive: true });
        }
        fs.writeFileSync(path.join(this.dist, 'notes.json'), JSON.stringify(this.notesForIndex, null, 2));
    }
}
