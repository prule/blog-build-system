# Blog Build System

This is a simple, file-based blog build system that generates a static website from your content. It uses Markdown or AsciiDoc for articles and Markdown for notes, and Mustache for templating.

## Getting Started

### Prerequisites

- Node.js and npm

### Installation

1. Clone the repository.
2. Install the dependencies:
   ```shell
   npm install
   ```

### Commands

**Build the project:**

This command transpiles the TypeScript source code into JavaScript.

```shell
npm run build
```

**Generate the site:**

This command generates the static website from your content and theme. 

The base parameter specifies where your site data is. 

```shell
node dist/index.js --base=./site
```

In the sample the site directory looks like this:

```text
site
├── build-configuration.json
├── site.json
│
├── content
│   ├── articles
│   │   ├── gradle-shared-config
│   │   │   ├── ReadMe.md
│   │   │   └── metadata.json
│   │   ├── json5
│   │   │   ├── Intellij-support-for-json5.png
│   │   │   ├── ReadMe.adoc
│   │   │   ├── metadata.json
│   │   │   ├── renovate.json5
│   │   │   ├── sample-javascript-json5.js
│   │   │   ├── sample-typescript-json5.ts
│   │   │   ├── sample-without-comments.json5
│   │   │   ├── sample.json
│   │   │   └── sample.json5
│   │   ├── renovate
│   │   │   ├── ReadMe.adoc
│   │   │   ├── github-build.png
│   │   │   ├── gradle.yml
│   │   │   ├── metadata.json
│   │   │   ├── renovate-dashboard-detail.png
│   │   │   ├── renovate-dashboard.png
│   │   │   ├── renovate.json5
│   │   │   ├── series.txt
│   │   │   └── tags.txt
│   │   └── sdkman
│   │       ├── ReadMe.adoc
│   │       ├── intellij-sdkman-support.png
│   │       ├── metadata.json
│   │       ├── sdk-list-java.txt
│   │       └── sdk-list.txt
│   └── notes
│       └── 0001.md
│
├── dist
│   ├── articles
│   │   ├── archive.html
│   │   ├── gradle-shared-config
│   │   │   ├── ReadMe.html
│   │   │   ├── index.html
│   │   │   └── metadata.json
│   │   ├── json5
│   │   │   ├── Intellij-support-for-json5.png
│   │   │   ├── ReadMe.html
│   │   │   ├── index.html
│   │   │   ├── metadata.json
│   │   │   ├── renovate.json5
│   │   │   ├── sample-javascript-json5.js
│   │   │   ├── sample-typescript-json5.ts
│   │   │   ├── sample-without-comments.json5
│   │   │   ├── sample.json
│   │   │   └── sample.json5
│   │   ├── renovate
│   │   │   ├── ReadMe.html
│   │   │   ├── github-build.png
│   │   │   ├── gradle.yml
│   │   │   ├── index.html
│   │   │   ├── metadata.json
│   │   │   ├── renovate-dashboard-detail.png
│   │   │   ├── renovate-dashboard.png
│   │   │   ├── renovate.json5
│   │   │   ├── series.txt
│   │   │   └── tags.txt
│   │   └── sdkman
│   │       ├── ReadMe.html
│   │       ├── index.html
│   │       ├── intellij-sdkman-support.png
│   │       ├── metadata.json
│   │       ├── sdk-list-java.txt
│   │       └── sdk-list.txt
│   ├── articles.json
│   ├── assets
│   │   ├── code-theme.css
│   │   ├── hljs-base-theme.css
│   │   ├── profile.png
│   │   ├── styles.css
│   │   └── theme.js
│   ├── index.html
│   ├── notes
│   │   ├── 0001.md
│   │   └── archive.html
│   ├── notes.json
│   ├── pages
│   └── series
│       └── index.html
│
└── theme
    ├── article-archive.html
    ├── article.html
    ├── assets
    │   ├── code-theme.css
    │   ├── hljs-base-theme.css
    │   ├── profile.png
    │   ├── styles.css
    │   └── theme.js
    ├── footer.html
    ├── head.html
    ├── header.html
    ├── index.html
    └── notes-archive.html
```

**Serve the generated site locally:**

This command starts a local web server to preview your site.

```shell
npm run serve
```

## Configuration

The build system is configured through two JSON files: `build-configuration.json` and `site.json`.

### `build-configuration.json`

This file defines the directory structure for your project.

```json
{
  "content": "./content",
  "theme": "./theme",
  "dist": "./dist"
}
```

- `content`: The directory where your articles and notes are stored.
- `theme`: The directory containing your website's theme and templates.
- `dist`: The directory where the generated static site will be saved.

### `site.json`

This file contains the global configuration for your site, such as the title, subtitle, and social media links.

```json
{
  "title": "My New Blog",
  "subTitle": "A place for my thoughts and ideas.",
  "socials": [
    {
      "icon": "github",
      "url": "https://github.com/prule"
    },
    {
      "icon": "linkedin",
      "url": "https://www.linkedin.com/in/paulrule"
    },
    {
      "icon": "x-twitter",
      "url": "https://x.com/prule"
    }
  ]
}
```

## Content

All your content is stored in the `content` directory, as specified in `build-configuration.json`.

### Articles

- Articles are organized in directories within the `content/articles` folder.
- Each article should be in its own directory and named `ReadMe.md` (for Markdown) or `ReadMe.adoc` (for AsciiDoc).
- Each article directory should contain its own assets such as images.
- Each article directory must contain a `metadata.json` file with the following structure:

```json
{
  "title": "My First Article",
  "subTitle": "A subtitle for my first article.",
  "date": "2024-01-01",
  "modifiedDate": "2024-01-02",
  "series": "My First Series",
  "tags": ["tag1", "tag2"]
}
```

### Notes

- Notes are stored in a single Markdown file named `notes.md` in the `content/notes` directory.
- Each note is separated by `----`.
- The first line of each note is the date in `YYYY-MM-DD` format, followed by the note's content.

**Example `notes.md`:**

```markdown
2024-01-01

This is my first note.

----

2024-01-02

This is my second note.
```

## Writing Articles

### Code Blocks

**Markdown:**

Use triple backticks to create code blocks, and specify the language for syntax highlighting.

````markdown
```typescript
console.log('Hello, World!');
```
````

**AsciiDoc:**

Use four hyphens to create code blocks, and specify the language and title.

```asciidoc
[source,typescript,title="Hello World in TypeScript"]
----
console.log('Hello, World!');
----
```

### Including Content from Files (AsciiDoc)

AsciiDoc allows you to include content from other files, which is useful for keeping your articles organized and reusing content.

**Include a file:**

```asciidoc
include::path/to/your/file.txt[]
```

**Include specific lines from a file:**

```asciidoc
include::path/to/your/file.txt[lines=1..5]
```

**Include a tagged region from a file:**

In the source file:

```java
// tag::my-region[]
System.out.println("Hello, World!");
// end::my-region[]
```

In your AsciiDoc file:

```asciidoc
include::path/to/your/file.java[tag=my-region]
```

## Theming

The website's appearance is controlled by the theme, which is located in the `theme` directory. The theme uses Mustache for templating.

### Templates

The following are the main template files:

- `index.html`: The home page.
- `article.html`: The template for a single article.
- `article-archive.html`: The page that lists all articles.
- `notes-archive.html`: The page that lists all notes.

### Partials

The theme also uses partials for reusable components:

- `head.html`: The `<head>` section of the HTML.
- `header.html`: The site header.
- `footer.html`: The site footer.
- `series-list.html`: The list of article series.

### Assets

Static assets such as CSS, JavaScript, and images are stored in the `theme/assets` directory. These files are copied to the `dist/assets` directory during the build process.

### Sample output from generating site

```shell
node dist/index.js --base=./site
Build configuration
Using base directory:  ~/WebstormProjects/blog-build-system/site
Successfully loaded configuration: { content: './content', theme: './theme', dist: './dist' }
Copying files from  ~/WebstormProjects/blog-build-system/site/content to  ~/WebstormProjects/blog-build-system/site/dist
Copy complete.
Transforming articles...
Transforming  ~/WebstormProjects/blog-build-system/site/dist/articles/gradle-shared-config/ReadMe.md
Transforming  ~/WebstormProjects/blog-build-system/site/dist/articles/json5/ReadMe.adoc
Transforming  ~/WebstormProjects/blog-build-system/site/dist/articles/renovate/ReadMe.adoc
Transforming  ~/WebstormProjects/blog-build-system/site/dist/articles/sdkman/ReadMe.adoc
Article transformation complete.
Writing article index...
Article index written successfully.
Transforming notes in ...  ~/WebstormProjects/blog-build-system/site/content/notes
Transforming note in ... 0001.md
Copying theme assets...
Theme assets copied successfully.
Theming articles...
Theming Sharing gradle configuration between modules
Theming JSON5
Theming Understanding Renovate
Theming Using Sdkman
Article theming complete.
Processing article archive...
Article archive processed successfully.
Processing notes archive...
Notes archive processed successfully.
Processing home page...
Home page processed successfully.
```
