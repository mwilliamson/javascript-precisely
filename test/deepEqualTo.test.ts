import assert from "assert";

import { deepEqualTo } from "../";
import { matched, unmatched } from "../lib/core";
import { describeValue } from "../lib/describeValue";

suite(__filename, () => {
    test("matches when primitive values are strictly equal", () => {
        const matcher = deepEqualTo(1);

        const result = matcher.match(1);

        assert.deepStrictEqual(result, matched());
    });

    test("does not matches when primitive values are equal but not strictly equal", () => {
        const matcher = deepEqualTo(1);

        const result = matcher.match("1");

        assert.deepStrictEqual(result, unmatched("was '1'"));
    });

    test("matches when objects are strictly equal", () => {
        const matcher = deepEqualTo({one: 1, two: [2]});

        const result = matcher.match({one: 1, two: [2]});

        assert.deepStrictEqual(result, matched());
    });

    test("does not match when objects are deep equal but not strictly equal", () => {
        const matcher = deepEqualTo({one: "1", two: ["2"]});

        const result = matcher.match({one: 1, two: [2]});

        assert.deepStrictEqual(result, unmatched("was { one: 1, two: [ 2 ] }"));
    });

    test("matches when maps have same entries", () => {
        const matcher = deepEqualTo(new Map([["a", 42]]));

        const result = matcher.match(new Map([["a", 42]]));

        assert.deepStrictEqual(result, matched());
    });

    test("does not match when maps have different entries", () => {
        const matcher = deepEqualTo(new Map([["a", 42]]));
        const actual = new Map([["a", 47]]);

        const result = matcher.match(actual);

        assert.deepStrictEqual(result, unmatched(`was ${describeValue(actual)}`));
    });

    test("explanation of mismatch contains actual", () => {
        const matcher = deepEqualTo(1);

        const result = matcher.match(2);

        assert.deepStrictEqual(result, unmatched("was 2"));
    });

    test("null and undefined are not considered equal", () => {
        const matcher = deepEqualTo(null);

        const result = matcher.match(undefined);

        assert.deepStrictEqual(result, unmatched("was undefined"));
    });

    const descriptionTestCases: Array<[string, unknown, string]> = [
        ["number", 1, "1"],
        ["string", "hello", "'hello'"],
        ["null", null, "null"],
        ["undefined", undefined, "undefined"],
        ["true", true, "true"],
        ["false", false, "false"],
    ];

    for (const [name, value, expectedDescription] of descriptionTestCases) {
        test(`description of ${name}`, () => {
            const matcher = deepEqualTo(value);

            const result = matcher.describe();

            assert.strictEqual(result, expectedDescription);
        });
    }
});
