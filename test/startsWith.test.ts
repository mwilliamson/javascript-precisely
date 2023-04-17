import assert from "assert";

import { startsWith } from "../";
import { matched, unmatched } from "../lib/core";

suite(__filename, () => {
    test("matches when actual string starts with value passed to matcher", () => {
        const matcher = startsWith("ab");

        assert.deepStrictEqual(matcher.match("ab"), matched());
        assert.deepStrictEqual(matcher.match("abc"), matched());
        assert.deepStrictEqual(matcher.match("abcd"), matched());
        assert.deepStrictEqual(matcher.match("a"), unmatched("was 'a'"));
        assert.deepStrictEqual(matcher.match("cab"), unmatched("was 'cab'"));
    });

    test("does not match when value is not a string", () => {
        const matcher = startsWith("ab");

        const result = matcher.match(20);

        assert.deepStrictEqual(result, unmatched("was 20"));
    });

    test("description of value", () => {
        const matcher = startsWith("ab");

        const result = matcher.describe();

        assert.strictEqual(result, "starts with: 'ab'")
    })
});
