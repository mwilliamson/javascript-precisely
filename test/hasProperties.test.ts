import assert from "assert";

import { equalTo, hasProperties } from "../";
import { matched, unmatched } from "../lib/core";

suite(__filename, () => {
    test("matches when properties all match", () => {
        const matcher = hasProperties({
            username: equalTo("bob"),
            emailAddress: equalTo("bob@example.com"),
        });

        const result = matcher.match({username: "bob", emailAddress: "bob@example.com"});

        assert.deepStrictEqual(result, matched());
    });

    test("mismatches when property is missing", () => {
        const matcher = hasProperties({
            username: equalTo("bob"),
            emailAddress: equalTo("bob@example.com"),
        });

        const result = matcher.match({emailAddress: "bob@example.com"});

        assert.deepStrictEqual(result, unmatched("was missing property 'username'"));
    });

    test("explanation of mismatch contains mismatch of property", () => {
        const matcher = hasProperties({
            username: equalTo("bob"),
            emailAddress: equalTo("bob@example.com"),
        });

        const result = matcher.match({username: "bob", emailAddress: "bobbity@example.com"});

        assert.deepStrictEqual(result, unmatched("property 'emailAddress' was 'bobbity@example.com'"));
    });

    test("submatcher is coerced to matcher", () => {
        const matcher = hasProperties({username: "bob"});

        const result = matcher.match({username: "bobbity"});

        assert.deepStrictEqual(result, unmatched("property 'username' was 'bobbity'"));
    });

    test("description contains descriptions of properties", () => {
        const matcher = hasProperties({
            username: equalTo("bob"),
            emailAddress: equalTo("bob@example.com"),
        });

        const result = matcher.describe();

        assert.strictEqual(
            result,
            "value with properties:\n * 'username': 'bob'\n * 'emailAddress': 'bob@example.com'",
        );
    });
});
