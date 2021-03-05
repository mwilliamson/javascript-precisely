import { Matcher, matched, unmatched } from "./core";

export function equalTo(value: unknown): Matcher {
    return {
        describe() {
            return toString(value);
        },

        match(actual: unknown) {
            if (value === actual) {
                return matched();
            } else {
                return unmatched(`was ${toString(actual)}`);
            }
        },
    };
}

function toString(value: unknown): string {
    if (typeof value === "string") {
        return JSON.stringify(value);
    } else {
        return String(value);
    }
}
