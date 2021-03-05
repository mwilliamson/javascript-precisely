import assert from "assert";

import { anything } from "../";
import { matched, unmatched } from "../lib/core";

suite(__filename, () => {
    test("matches anything", () => {
        assert.deepStrictEqual(anything.match(4), matched());
        assert.deepStrictEqual(anything.match(null), matched());
        assert.deepStrictEqual(anything.match("Hello"), matched());
    });

    test("description is 'anything'", () => {
        assert.strictEqual(anything.describe(), "anything");
    });
});
