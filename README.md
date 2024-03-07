# Internet Speed Test in JS/HTML/CSS

## Description

This is a (can be a?) (localhost) web app that will test the speed of your network connection and give you a few statistics,
including final download speed, average download speed, and time elapsed.

Note that this does require an internet connection (of course).

## Dependencies

* Development Dependencies
    * `browser-sync ^3.0.2`
    * `browserify ^17.0.0`
    * `npm-run-all ^4.1.5`
* User Dependencies
    * none

If you want to fork/develop this project further, clone it or download the repository onto your system, and then you can install all (missing) dependencies with `npm install` in the command line in the same directory as `package.json`. The project is configured to run in Visual Studio Code, so if you have it, you can start the program using the configurations specified in `.vscode/launch.json` with `Run > Start Debugging` (F5).

Note that if you make changes to the source file(s) in `src` you will need to end debugging to close the live server from `browser-sync` and then start debugging again to see changes, because that will rebuild `bin/bundle.js`. Or you can just run `browserify ./src/main.js -o ./bin/bundle.js` in the terminal.

Because this project uses browserify, you can use nodejs' `require` functionality to modularize your web app source code, so you can take advantage of that

## How to use

1. Open `index.html` in your browser. It should automatically load the `bundle.js` from the `bin` folder.
2. You can set the slider to the amount of interval time between each calculation of the average. Lower values means less time between each update meaning a more accurate result in the end, but also fills up an internal array with more information, taking up more memory. Higher values means more time between each update, but also fills up the array with an insufficient amount of information, leading to a less accurate result.
3. Click the "Start speed test" button
4. Test will begin and run for a maximum of 15 seconds, or until the file finishes downloading
    a. You can stop the test at any time by clicking "Stop speed test". Results will be reset to 0.
5. Upon completion, the results will tell you the final speed, a rough estimate for the average speed during the test, and the amount of time it took to complete.

## References

* Most of the coding here was followed from [this](https://www.youtube.com/watch?v=p-EQgJ8M2To) tutorial on creating a speed test in JS
* The file being downloaded is an 18.4 MB file called 'sample-1.wav' from [this website](https://getsamplefiles.com/sample-audio-files/wav).

## License

* Free to use how you see fit.