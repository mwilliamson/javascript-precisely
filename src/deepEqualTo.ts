import deepEqual from "fast-deep-equal";

import { Matcher, matched, unmatched } from "./core";
import { describeValue } from "./describeValue";

export function deepEqualTo(value: unknown): Matcher {
    return {
        describe() {
            return describeValue(value);
        },

        match(actual: unknown) {
            if (deepEqual(value, actual)) {
                return matched();
            } else {
                return unmatched(`was ${describeValue(actual)}`);
            }
        },
    };
}
