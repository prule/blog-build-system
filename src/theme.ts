export class ThemeProcessor {
    private readonly theme: string;
    private readonly dist: string;

    constructor(theme: string, dist: string) {
        this.theme = theme;
        this.dist = dist;
    }

    /**
     * Finds all the ReadMe.html files in the dist/articles folder.
     * Then, it loads the metadata.json beside it. This looks like
     * ```
     * {
     *   "title": "Sharing gradle configuration between modules",
     *   "subTitle": "",
     *   "date": "2025-02-08",
     *   "modifiedDate": "2025-02-08",
     *   "series": "build",
     *   "tags": ["programming", "build", "gradle"]
     * }
     * ```
     * These values and the content of the ReadMe.html file are
     * then injected into the article template file to produce index.html.
     */
    processArticles() {

    }
}
