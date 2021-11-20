import { Matcher } from "./core";
import { equalTo } from "./equalTo";

export function isMatcher(value: unknown): value is Matcher {
    return value != null &&
        Object.prototype.hasOwnProperty.call(value, "match") &&
        Object.prototype.hasOwnProperty.call(value, "describe");
}

export function toMatcher(value: unknown): Matcher {
    if (isMatcher(value)) {
        return value;
    } else {
        return equalTo(value);
    }
}
