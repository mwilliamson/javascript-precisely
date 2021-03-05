import { Matcher } from "./core";
import { equalTo } from "./equalTo";

function isMatcher(value: unknown): value is Matcher {
    return Object.prototype.hasOwnProperty.call(value, "match") &&
        Object.prototype.hasOwnProperty.call(value, "describe");
}

export function toMatcher(value: unknown): Matcher {
    if (isMatcher(value)) {
        return value;
    } else {
        return equalTo(value);
    }
}
