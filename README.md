# create-p5js-app

Generate a basic [p5.js](https://p5js.org/) project scaffold with a single command.

## Installation

```bash
npm install -g create-p5js-app
```

Or just use it via `npx`:

```bash
npx create-p5js-app
```

## Usage

```bash
# Create a new project in 'my-sketch' folder
create-p5js-app my-sketch

# Or skip dependencies installation
create-p5js-app my-sketch --no-install
```

If no path is provided, you'll be prompted for a project name.

## What It Does

- Creates a new folder (or uses an existing empty one).
- Copies a minimal p5.js setup (including package.json, an index.html, and a sketch file).
- Installs dependencies by default (unless `--no-install` is used).

Once the project is created, just:

```bash
cd <project-folder>
npm start
```

to run your p5 sketch locally. Enjoy!
