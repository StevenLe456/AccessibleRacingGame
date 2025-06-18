# AccessibleRacingGame

## Brief Description

This is the Group 6 project for CSCE.3444 at the University of North Texas during the Summer 2025 semester with Professor Hadish Gooranorimi.

## Development Documentation

### List of directories and files

* public/ - Contains external files (ex. HTML, CSS, images, etc.)
    * index.html - The main HTML file
    * rainbow.fragment.fx - Rainbow fragment shader code
    * rainbow.vertex.fx - Rainbow vertex shader code
    * style.css - The main styling sheet
* src/ - Contains the Typescript files
    * car.ts - Contains the Car class
    * cv.ts - Contains the computer vision module code
    * game.ts - Contains the game rendering code
    * input.ts - Contains the input management code
    * main.ts - Contains the main loop
* .gitignore - For Git purposes
* package-lock.json - Do not edit
* package.json - Contains npm and Javascript-related metadata and configuration
* README.md - You are here
* tsconfig.json - Contains Typescript-related metadata and configuration

### How to Build and Run

First, to initialize the project, run `npm install` after cloning the reposititory to your local machine.

To build a non-production build, create a folder called `test` and run the following command:
`npm run test`

To build a production build, create a folder called `dist` and run the following command:
`npm run dist`

Then, go into the respective folder and use a webserver to open up the web app.
