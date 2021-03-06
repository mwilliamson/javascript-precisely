import assert from "assert";

import { includes, equalTo } from "../";
import { matched, unmatched } from "../lib/core";

suite(__filename, () => {
    test("matches array when all submatchers match one item with no items leftover", () => {
        const matcher = includes(equalTo("apple"), equalTo("banana"));

        const result = matcher.match(["banana", "apple"]);

        assert.deepStrictEqual(result, matched());
    });

    test("matches array-like when all submatchers match one item with no items leftover", () => {
        const matcher = includes(equalTo("apple"), equalTo("banana"));

        const result = matcher.match({length: 2, 0: "banana", 1: "apple"});

        assert.deepStrictEqual(result, matched());
    });

    test("matches iterable when all submatchers match one item with no items leftover", () => {
        const matcher = includes(equalTo("apple"), equalTo("banana"));

        const result = matcher.match(new Set(["banana", "apple"]));

        assert.deepStrictEqual(result, matched());
    });

    test("mismatches when actual is neither iterable not array-like", () => {
        const matcher = includes(equalTo("apple"), equalTo("banana"));

        const result = matcher.match(0);

        assert.deepStrictEqual(result, unmatched("was neither iterable nor array-like\nwas 0"));
    });

    test("mismatches when item is missing", () => {
        const matcher = includes(equalTo("apple"), equalTo("banana"), equalTo("coconut"));

        const result = matcher.match(["coconut", "apple"]);

        assert.deepStrictEqual(result, unmatched(
            "was missing element:\n * 'banana'\n" +
            "These elements were in the iterable but did not match the missing element:\n" +
            " * 'coconut': was 'coconut'\n" +
            " * 'apple': already matched"
        ));
    });

    test("mismatches when duplicate is missing", () => {
        const matcher = includes(equalTo("apple"), equalTo("apple"));

        const result = matcher.match(["apple"]);

        assert.deepStrictEqual(result, unmatched(
            "was missing element:\n * 'apple'\n" +
            "These elements were in the iterable but did not match the missing element:\n" +
            " * 'apple': already matched"
        ));
    });

    test("mismatches when item is expected but iterable is empty", () => {
        const matcher = includes(equalTo("apple"));

        const result = matcher.match([]);

        assert.deepStrictEqual(result, unmatched("iterable was empty"));
    });

    test("when no elements are expected then empty iterable matches", () => {
        const matcher = includes();

        const result = matcher.match([]);

        assert.deepStrictEqual(result, matched());
    });

    test("matches when there are extra items", () => {
        const matcher = includes(equalTo("apple"));

        const result = matcher.match(["coconut", "apple"]);

        assert.deepStrictEqual(result, matched());
    });

    test("description contains descriptions of submatchers", () => {
        const matcher = includes(equalTo("apple"), equalTo("banana"));

        const result = matcher.describe();

        assert.strictEqual(result, "iterable including elements:\n * 'apple'\n * 'banana'");
    });

    test("elements are coerced to matchers", () => {
        const matcher = includes("apple", "banana");

        const result = matcher.describe();

        assert.strictEqual(result, "iterable including elements:\n * 'apple'\n * 'banana'");
    });
});
