import { Failure, Matcher, matched, unmatched } from "./core";
import { describeValue } from "./describeValue";
import { indentedList } from "./formatting";
import { toMatcher } from "./toMatcher";

export function containsExactly(...valuesOrMatchers: Array<unknown>): Matcher {
    const elementMatchers = valuesOrMatchers.map(matcherOrValue => toMatcher(matcherOrValue));

    return {
        describe() {
            return "";
        },

        match(actual: unknown) {
            if (!isArrayLike(actual) && !isIterable(actual)) {
                return unmatched(`was neither iterable nor array-like\nwas ${describeValue(actual)}`);
            }
            const actualArray = Array.from(actual);

            const elementMatches = actualArray.map(element => ({
                element: element,
                isMatched: false,
            }));

            for (const elementMatcher of elementMatchers) {
                const mismatches: Array<Failure> = [];
                let elementMatcherMatched = false;
                for (const elementMatch of elementMatches) {
                    if (elementMatch.isMatched) {
                        mismatches.push(unmatched("already matched"));
                    } else {
                        const elementResult = elementMatcher.match(elementMatch.element);
                        if (elementResult.isMatch) {
                            elementMatch.isMatched = true;
                            elementMatcherMatched = true;
                            break;
                        } else {
                            mismatches.push(elementResult);
                        }
                    }
                }
                if (!elementMatcherMatched) {
                    if (actualArray.length === 0) {
                        return unmatched("iterable was empty");
                    } else {
                        return unmatched(
                            `was missing element:${indentedList([elementMatcher.describe()])}\n` +
                            "These elements were in the iterable but did not match the missing element:" +
                            indentedList(actualArray.map(
                                (element, elementIndex) => `${describeValue(element)}: ${mismatches[elementIndex].explanation}`
                            )),
                        );
                    }
                }
            }

            const allMatched = elementMatches.every(match => match.isMatched);
            if (allMatched) {
                return matched();
            } else {
                const unmatchedElementDescriptions = elementMatches
                    .filter(match => !match.isMatched)
                    .map(match => describeValue(match.element));

                return unmatched(`had extra elements:${indentedList(unmatchedElementDescriptions)}`);
            }
        },
    };
}

function isArrayLike(value: unknown): value is ArrayLike<unknown> {
    return typeof value === "object" && value != null && typeof (value as any).length === "number";
}

function isIterable(value: unknown): value is Iterable<unknown> {
    return typeof value === "object" && value != null && typeof (value as any)[Symbol.iterator] != null;
}
