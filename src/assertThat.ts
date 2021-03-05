import AssertionError from "assertion-error";

import { Matcher } from "./core";
import { indent } from "./formatting";

export function assertThat<T>(value: T, matcher: Matcher): void {
    const result = matcher.match(value);
    if (!result.isMatch) {
        const matcherDescription = indent("\n" + matcher.describe());
        const explanation = indent("\n" + indent(result.explanation));
        throw new AssertionError(`\nExpected:${matcherDescription}\nbut:${explanation}`);
    }
}
