# AccessibleRacingGame

## Brief Description

This is the Group 6 project for CSCE.3444 at the University of North Texas during the Summer 2025 semester with Professor Hadish Gooranorimi.

## Development Documentation

### List of directories and files

* public/ - Contains external files (ex. HTML, CSS, images, etc.)
    * index.html - The main HTML file
    * style.css - The main styling sheet
* src/ - Contains the Typescript files
    * game.ts - Contains the game rendering code
    * main.ts - Contains the main loop
* .gitignore - For Git purposes
* package-lock.json - Do not edit
* package.json - Contains npm and Javascript-related metadata and configuration
* README.md - You are here
* tsconfig.json - Contains Typescript-related metadata and configuration

### How to Build and Run

To build a non-production build, create a folder called `test` and run the following command:
`npm run test`

To build a production build, create a folder called `dist` and run the following command:
`npm run dist`

Then, go into the respective folder and use a webserver to open up the web app.
