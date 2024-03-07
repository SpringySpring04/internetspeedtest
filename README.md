# Internet Speed Test in JS/HTML/CSS

Note that this does require an internet connection (of course).

## How to use

1. You can set the slider to the amount of interval time between each calculation of the average. Lower values means less time between each update meaning a more accurate result in the end, but also fills up an internal array with more information, taking up more memory. Higher values means more time between each update, but also fills up the array with an insufficient amount of information, leading to a less accurate result.
2. Click the "Start speed test" button
3. Test will begin and run for a maximum of 15 seconds, or until the file finishes downloading
    a. You can stop the test at any time by clicking "Stop speed test". Results will be reset to 0.
4. Upon completion, the results will tell you the final speed, a rough estimate for the average speed during the test, and the amount of time it took to complete.

## References

* Most of the coding here was followed from [this](https://www.youtube.com/watch?v=p-EQgJ8M2To) tutorial on creating a speed test in JS
* The file being downloaded is an 18.4 MB file called 'sample-1.wav' from [this website](https://getsamplefiles.com/sample-audio-files/wav).

## License

* Free to use how you see fit.