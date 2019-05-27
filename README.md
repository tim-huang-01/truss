## Summary
This is my work for completing the code challenge
found at: https://github.com/trussworks/truss-interview

The total time of work was approximately 3 hours and 30 minutes.

The most difficult parts of the challenge were parsing and
formatting of timestamps and filtering out invalid utf-8 characters. 

## Execution
As specified in requirements, one may run the program:
```
./normalizer < /path/to/sample.csv > ./output.csv
```

A (very limited) test suite can be run:
```
yarn test
# Assuming node and yarn are installed
```

## Methodology
First, a test file (`test.spec.js`) was used to
develop the various normalizing functions.

Once it was determined that the normalized output
of each function was correct, the "outer" script was
written, which reads and processes data from stdin
line-by-line using the normalizing functions written prior.

Debugging involved running the test file during development
and running the `normalizer` script file with the
provided sample data until things looked "right".

## Notes
The Unicode character set is confusing, probably
because it encapsulates so much. Not only are there multiple
specificatios, UTF-8, UTF-16, and UTF-32, but there are
also multiple ways in which they're interepreted by available languages.
Unicode also has the concept of [Planes](https://en.wikipedia.org/wiki/Plane_(Unicode)), which can add to the confusion.

Javascript, being heavily used in browser apps, seems optimized for
dealing with UTF-8 characters. This seems to imply that any invalid
UTF-8 characters are automatically stripped from input. Thus, the
output may not match with how other languages interpret the strings
with broken UTF-8 sequences.

With more time, it would be nice to confirm this behavior.

During development, I found two ways of validating UTF-8 data,
both are included in the `validateUtf8` function in `normalizerHelpers.js`.
