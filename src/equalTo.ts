import { Matcher, matched, unmatched } from "./core";

export function equalTo(value: unknown): Matcher {
    return {
        describe() {
            // TODO: equivalent of repr()?
            return String(value);
        },

        match(actual: unknown) {
            if (value === actual) {
                return matched();
            } else {
                return unmatched(`was ${actual}`);
            }
        },
    };
}
