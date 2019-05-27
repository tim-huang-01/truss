const csvParser = require('./csvParser').test
const normalizerHelpers = require('./normalizerHelpers')

describe('normalizing functions', () => {
  // const data = csvParser('../sample.csv')
  const data = csvParser('../sample-with-broken-utf8.csv')
  let testRow

  beforeEach(() => {
    testRow = data[0]
  })

  it('converts PT timestamps to ET in ISO-8601 format', () => {
    const normalizedTimestamp = normalizerHelpers.timestamp(testRow.timestamp)

    const validDate = new Date(normalizedTimestamp)

    expect(validDate.getMonth()).toEqual(3)
    expect(validDate.getDate()).toEqual(1)
    expect(validDate.getFullYear()).toEqual(2011)
    expect(validDate.getHours()).toEqual(11)
    expect(validDate.getMinutes()).toEqual(0)
    expect(validDate.getSeconds()).toEqual(0)
  })

  it('formats ZIP codes as 5 digits, with leading zeros as padding for missing digits', () => {
    const normalizedZipCode = normalizerHelpers.zipCode(testRow.zip)

    expect(normalizedZipCode).toEqual('94121')
  })

  it('converts the FullName column to uppercase', () => {
    const normalizedFullName = normalizerHelpers.fullName(testRow.fullName)

    expect(normalizedFullName).toEqual('MONKEY ALBERTO')
  })

  it('passes through the Address column except for Unicode validation', () => {
    /**
     * The `Address` column should be passed through as is, except for
     * Unicode validation. Please note there are commas in the Address
     * field; your CSV parsing will need to take that into account. Commas
     * will only be present inside a quoted string.
     */
    testRow = data[5]

    const normalizedAddress = normalizerHelpers.address(testRow.address)

    expect(normalizedAddress).toEqual('überTown')
  })

  it('represents FooDuration and BarDuration as the total number of seconds (unrounded)', () => {
    const normalizedFooDuration = normalizerHelpers.duration(testRow.fooDuration)
    const normalizedBarDuration = normalizerHelpers.duration(testRow.barDuration)

    expect(normalizedFooDuration).toEqual(5012.123)
    expect(normalizedBarDuration).toEqual(5553.123)
  })

  it('replaces TotalDuration with the sum of FooDuration and BarDuration', () => {
    const normalizedFooDuration = normalizerHelpers.duration(testRow.fooDuration)
    const normalizedBarDuration = normalizerHelpers.duration(testRow.barDuration)
    const normalizedTotalDuration = normalizerHelpers.totalDuration(normalizedFooDuration, normalizedBarDuration)

    expect(normalizedTotalDuration).toEqual(10565.246)
  })

  it('passes through the notes column except for Unicode validation', () => {
    testRow = data[0]
    const normalizedNotes = normalizerHelpers.notes(testRow.notes)

    expect(normalizedNotes).toEqual('I am the very model of a modern major general')
  })
})
