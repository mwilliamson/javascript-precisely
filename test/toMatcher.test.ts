import assert from "assert";

import {isMatcher} from "../lib/toMatcher";
import {equalTo} from "../";

suite(__filename, () => {
    test("returns true on matchers", () => {
        const value = equalTo("apple");

        const result = isMatcher(value);

        assert.deepStrictEqual(result, true);
    });

    test("returns false on numbers", () => {
        const result = isMatcher(4);

        assert.deepStrictEqual(result, false);
    });

    test("returns false on strings", () => {
        const result = isMatcher("hello");

        assert.deepStrictEqual(result, false);
    });

    test("returns false on objects", () => {
        const result = isMatcher({});

        assert.deepStrictEqual(result, false);
    });

    test("returns false on arrays", () => {
        const result = isMatcher([]);

        assert.deepStrictEqual(result, false);
    });

    test("returns false on null", () => {
        const result = isMatcher(null);

        assert.deepStrictEqual(result, false);
    });

    test("returns false on undefined", () => {
        const result = isMatcher(undefined);

        assert.deepStrictEqual(result, false);
    });
});
