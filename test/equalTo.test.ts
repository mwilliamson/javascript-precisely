import assert from "assert";

import { equalTo } from "../";
import { matched, unmatched } from "../lib/core";

suite(__filename, () => {
    test("matches when primitive values are strictly equal", () => {
        const matcher = equalTo(1);

        const result = matcher.match(1);

        assert.deepStrictEqual(result, matched());
    });

    test("does not matches when primitive values are equal but not strictly equal", () => {
        const matcher = equalTo(1);

        const result = matcher.match("1");

        assert.deepStrictEqual(result, unmatched("was '1'"));
    });

    test("matches when objects are strictly equal", () => {
        const matcher = equalTo(1);

        const result = matcher.match(1);

        assert.deepStrictEqual(result, matched());
    });

    test("does not match when objects are deep equal but not strictly equal", () => {
        const matcher = equalTo({});

        const result = matcher.match({});

        assert.deepStrictEqual(result, unmatched("was {}"));
    });

    test("explanation of mismatch contains actual", () => {
        const matcher = equalTo(1);

        const result = matcher.match(2);

        assert.deepStrictEqual(result, unmatched("was 2"));
    });

    test("null and undefined are not considered equal", () => {
        const matcher = equalTo(null);

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
            const matcher = equalTo(value);

            const result = matcher.describe();

            assert.strictEqual(result, expectedDescription);
        });
    }
});
