# llm-content-creator (Allen-GPT)

This is a simple script which researches a topic generates comprehensive research on the topic. It then uses some body of context (your own writing) to rewrite the research as a blog in your own style.

There are a bunch of setup stuff to do to get this working, but it's a fun project to play with.

## Setup 
- Modify the `index.ts` file to change the content being generated.
- Add some context to a directory called `context` in the root of the project.
- Copy .env_example to .env and add api keys

## Usage

Install dependencies:

```bash
bun install
```
Run the script

```bash
bun run index.ts
```
