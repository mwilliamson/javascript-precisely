import { Matcher, matched, unmatched } from "./core";
import { describeValue } from "./describeValue";
import { indentedList } from "./formatting";
import { toMatcher } from "./toMatcher";

export function hasProperties(propertyMatchersOrValues: {[key: string]: unknown}): Matcher {
    const propertyMatchers: Array<[string, Matcher]> = Object.entries(propertyMatchersOrValues)
        .map(([key, matcherOrValue]) => [key, toMatcher(matcherOrValue)]);

    return {
        describe() {
            return "value with properties:" + indentedList(
                propertyMatchers.map(([key, propertyMatcher]) =>
                    `${describeValue(key)}: ${propertyMatcher.describe()}`
                ),
            );
        },

        match(value: unknown) {
            for (const [key, propertyMatcher] of propertyMatchers) {
                if (!Object.prototype.hasOwnProperty.call(value, key)) {
                    return unmatched(`was missing property ${describeValue(key)}`);
                }
                const propertyResult = propertyMatcher.match((value as any)[key]);
                if (!propertyResult.isMatch) {
                    return unmatched(`property ${describeValue(key)} ${propertyResult.explanation}`);
                }
            }
            return matched();
        },
    };
};
