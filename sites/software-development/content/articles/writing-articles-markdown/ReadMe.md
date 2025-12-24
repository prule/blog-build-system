## Writing Articles using Markdown

### Images

````text
![My custom diagram](./porsche.webp)
````
renders as
![Porsche 911 RSR 2017](./porsche.webp)


### YouTube
````text
[https://youtu.be/lfGjtivHb-o](https://youtu.be/lfGjtivHb-o)
````
renders as

[https://youtu.be/lfGjtivHb-o](https://youtu.be/lfGjtivHb-o)


### Code Blocks

Use triple backticks to create code blocks, and specify the language for syntax highlighting.

````
```typescript
console.log('Hello, World!');
console.log('Hello, World!');
console.log('Hello, World!');
```
````

renders as

```typescript
console.log('Hello, World!');
console.log('Hello, World!');
console.log('Hello, World!');
```

## Mermaid diagrams

````text
```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```
````
renders as
```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```
