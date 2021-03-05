import assert from "assert";

import { assertThat, equalTo } from "../";

suite(__filename, () => {
    test("assertThat does nothing if matcher matches", () => {
        assertThat(1, equalTo(1));
    });

    test("assertThat raises assertion error if match fails", () => {
        try {
            assertThat(1, equalTo(2));
            assert.fail("Expected AssertionError");
        } catch (error) {
            assert.strictEqual(error.message, "\nExpected:\n  2\nbut:\n  was 1");
        }
    });
});
