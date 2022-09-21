import {assertionSeries, entityTypeLookup, equalizeAssertionsSize, filterSeries} from "../../util/insights";

test("Filter series", () => {
    const series = [{badge_class_id: 1}, {badge_class__issuer__id: 2}, {badge_class__issuer__faculty_id: 3}]
    let results = filterSeries(series, entityTypeLookup.ENROLMENT);
    expect(results.length).toEqual(3);

    results = filterSeries(series, entityTypeLookup.ENROLMENT, undefined, {identifier: 9}, {identifier: 9}, {identifier: 9});
    expect(results.length).toEqual(0);

    series.push({award_type: 'requested', badge_class_id: 9});

    results = filterSeries(series, entityTypeLookup.ENROLMENT, 'requested', {identifier: 9});
    expect(results.length).toEqual(1);

    series[3].badge_class__issuer__id = 2;
    results = filterSeries(series, entityTypeLookup.ENROLMENT, null, {identifier: 9}, {identifier: 2}, null);
    expect(results.length).toEqual(1);
});

test("Assertion series", () => {
    const assertions = [
        {year: 2021, month: 9, nbr: 1},
        {year: 2021, month: 9, nbr: 3},
        {year: 2021, month: 10, nbr: 5},
        {year: 2022, month: 3, nbr: 1},
        {year: 2022, month: 3, nbr: 1},
        {year: 2022, month: 5, nbr: 1},
    ]
    let results = assertionSeries(assertions);
    expect(results.map(assertion => assertion.nbr)).toStrictEqual([4, 9, 9, 9, 9, 9, 11, 11, 12]);
});

test("Equalize Assertions size, adding to front and back of an assertion series", () => {
    const daAssertions = [
        {nbr: 1, year: 2021, month: 10},
        {nbr: 2, year: 2021, month: 11},
        {nbr: 3, year: 2021, month: 12},
        {nbr: 4, year: 2022, month: 1},
        {nbr: 5, year: 2022, month: 2},
    ];
    const reqAssertions = [
        {nbr: 1, year: 2021, month: 11},
        {nbr: 2, year: 2021, month: 12},
    ];
    let results = equalizeAssertionsSize(daAssertions, reqAssertions);
    let daExpected = daAssertions;
    let reqExpected = [
        {nbr: 0},
        {nbr: 1, year: 2021, month: 11},
        {nbr: 2, year: 2021, month: 12},
        {nbr: 2},
        {nbr: 2}
    ]
    expect(results[0]).toStrictEqual(daExpected);
    expect(results[1]).toStrictEqual(reqExpected);
});

test("Equalize Assertions size, adding to front and back of both", () => {
    const daAssertions = [
        {nbr: 1, year: 2021, month: 10},
        {nbr: 2, year: 2021, month: 11},
    ];
    const reqAssertions = [
        {nbr: 1, year: 2022, month: 1},
    ];
    let results = equalizeAssertionsSize(daAssertions, reqAssertions);
    let daExpected = [
        {nbr: 1, year: 2021, month: 10},
        {nbr: 2, year: 2021, month: 11},
        {nbr: 2},
        {nbr: 2},
    ]
    let reqExpected = [
        {nbr: 0},
        {nbr: 0},
        {nbr: 0},
        {nbr: 1, year: 2022, month: 1}
    ]
    expect(results[0]).toStrictEqual(daExpected);
    expect(results[1]).toStrictEqual(reqExpected);
})

