import { Matcher, matched, unmatched } from "./core";
import { describeValue } from "./describeValue";

export function equalTo(value: unknown): Matcher {
    return {
        describe() {
            return describeValue(value);
        },

        match(actual: unknown) {
            if (value === actual) {
                return matched();
            } else {
                return unmatched(`was ${describeValue(actual)}`);
            }
        },
    };
}
