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

```shell
node dist/index.js --base=./site
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

## Theming

The website's appearance is controlled by the theme, which is located in the `theme` directory. The theme uses Mustache for templating.

### Templates

The following are the main template files:

- `index.html`: The home page.
- `article.html`: The template for a single article.
- `article-archive.html`: The page that lists all articles.
- `notes-archive.html`: The page that lists all notes.
- `series.html`: The page that lists all article series.

### Partials

The theme also uses partials for reusable components:

- `head.html`: The `<head>` section of the HTML.
- `header.html`: The site header.
- `footer.html`: The site footer.
- `series-list.html`: The list of article series.

### Assets

Static assets such as CSS, JavaScript, and images are stored in the `theme/assets` directory. These files are copied to the `dist/assets` directory during the build process.
