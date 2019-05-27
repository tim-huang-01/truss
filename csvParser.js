const fs = require('fs')

exports.parseRow = (csvRow) => {
  // Split data by unquoted parts and quoted parts
  // that have commas in the data (Addresses)
  const dataParts = CSVtoArray(csvRow)

  // Warn us if there's not enough (or too much) data
  if (dataParts.length !== 8) {
    process.stderr.write(
      'WARNING: CSV row did not contain the correct ' +
      'number of data fields. Skipping.'
    )
    process.stderr.write(csvRow)
  }

  const [
    timestamp,
    address,
    zip,
    fullName,
    fooDuration,
    barDuration,
    totalDuration,
    notes
  ] = dataParts

  return {
    timestamp,
    address,
    zip,
    fullName,
    fooDuration,
    barDuration,
    totalDuration,
    notes
  }
}

exports.test = (filePath) => {
  // Read raw data. NOTE: To optimize, we'd want to
  // read the file as a stream for huge datasets.
  const csv = fs.readFileSync(filePath).toString()
  const rows = csv.split('\n')

  // Map data to objects for easier manipulation in JS
  const rowsMappedToObjects = rows.reduce((mappedRows, currentRow) => {
    const parsedRow = exports.parseRow(currentRow)
    mappedRows.push(parsedRow)
    return mappedRows
  }, [])

  return rowsMappedToObjects.slice(1)
}

/**
 * This snippet was taken from answer in StackOverflow.
 * @see https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
 */
function CSVtoArray(text) {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) return null;
    var a = [];                     // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
        function(m0, m1, m2, m3) {
            // Remove backslash from \' in single quoted values.
            if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
            // Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined) a.push(m3);
            return ''; // Return empty string.
        });
    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('');
    return a;
};
