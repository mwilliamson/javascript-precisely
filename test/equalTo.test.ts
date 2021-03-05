import assert from "assert";

import { equalTo } from "../";
import { matched, unmatched } from "../lib/core";

suite(__filename, () => {
    test("matches when values are strictly equal", () => {
        const matcher = equalTo(1);

        const result = matcher.match(1);

        assert.deepStrictEqual(result, matched());
    });

    test("explanation of mismatch contains actual", () => {
        const matcher = equalTo(1);

        const result = matcher.match(2);

        assert.deepStrictEqual(result, unmatched("was 2"));
    });

    test("description is value string", () => {
        const matcher = equalTo(1);

        const result = matcher.describe();

        assert.strictEqual(result, "1");
    });
});
