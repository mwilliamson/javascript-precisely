import assert from "assert";

import { equalTo, isSequence } from "../";
import { matched, unmatched } from "../lib/core";

suite(__filename, () => {
    test("matches array when all submatchers match one item with no items leftover", () => {
        const matcher = isSequence(equalTo("apple"), equalTo("banana"));

        const result = matcher.match(["apple", "banana"]);

        assert.deepStrictEqual(result, matched());
    });

    test("matches array-like when all submatchers match one item with no items leftover", () => {
        const matcher = isSequence(equalTo("apple"), equalTo("banana"));

        const result = matcher.match({length: 2, 0: "apple", 1: "banana"});

        assert.deepStrictEqual(result, matched());
    });

    test("matches iterable when all submatchers match one item with no items leftover", () => {
        const matcher = isSequence(equalTo("apple"), equalTo("banana"));

        const result = matcher.match(new Set(["apple", "banana"]));

        assert.deepStrictEqual(result, matched());
    });

    test("mismatched when actual is not iterable", () => {
        const matcher = isSequence(equalTo("apple"));

        const result = matcher.match(0);

        assert.deepStrictEqual(result, unmatched("was neither iterable nor array-like\nwas 0"));
    });

    test("mismatches when items are in wrong order", () => {
        const matcher = isSequence(equalTo("apple"), equalTo("banana"));

        const result = matcher.match(["banana", "apple"]);

        assert.deepStrictEqual(result, unmatched("element at index 0 mismatched:\n * was 'banana'"));
    });

    test("mismatches when item is missing", () => {
        const matcher = isSequence(equalTo("apple"), equalTo("banana"), equalTo("coconut"));

        const result = matcher.match(["apple", "banana"]);

        assert.deepStrictEqual(result, unmatched("element at index 2 was missing"));
    });

    test("mismatches when item is expected but iterable is empty", () => {
        const matcher = isSequence(equalTo("apple"));

        const result = matcher.match([]);

        assert.deepStrictEqual(result, unmatched("iterable was empty"));
    });

    test("when empty iterable is expected then empty iterable matches", () => {
        const matcher = isSequence();

        const result = matcher.match([]);

        assert.deepStrictEqual(result, matched());
    });

    test("mismatches when contains extra item", () => {
        const matcher = isSequence(equalTo("apple"));

        const result = matcher.match(["apple", "coconut"]);

        assert.deepStrictEqual(result, unmatched("had extra elements:\n * 'coconut'"));
    });

    test("when there are zero submatchers then description is of empty iterable", () => {
        const matcher = isSequence();

        const result = matcher.describe();

        assert.strictEqual(result, "empty iterable");
    });

    test("description contains descriptions of submatchers", () => {
        const matcher = isSequence(equalTo("apple"), equalTo("banana"));

        const result = matcher.describe();

        assert.strictEqual(result, "iterable containing in order:\n 0: 'apple'\n 1: 'banana'");
    });

    test("elements are coerced to matcheds", () => {
        const matcher = isSequence("apple", "banana");

        const result = matcher.describe();

        assert.strictEqual(result, "iterable containing in order:\n 0: 'apple'\n 1: 'banana'");
    });
});
