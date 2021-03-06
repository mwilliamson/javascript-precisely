import { Failure, Matcher, Result, matched, unmatched } from "./core";
import { describeValue } from "./describeValue";
import { indentedList } from "./formatting";
import { toMatcher } from "./toMatcher";

export function containsExactly(...valuesOrMatchers: Array<unknown>): Matcher {
    const elementMatchers = valuesOrMatchers.map(matcherOrValue => toMatcher(matcherOrValue));

    return {
        describe() {
            const elementMatchersDescription = indentedList(
                elementMatchers.map(elementMatcher => elementMatcher.describe()),
            );
            if (elementMatchers.length === 0) {
                return "empty iterable";
            } else if (elementMatchers.length === 1) {
                return `iterable containing 1 element:${elementMatchersDescription}`;
            } else {
                return `iterable containing these ${elementMatchers.length} elements in any order:${elementMatchersDescription}`;
            }
        },

        match(actual: unknown) {
            if (!isArrayLike(actual) && !isIterable(actual)) {
                return unmatched(`was neither iterable nor array-like\nwas ${describeValue(actual)}`);
            }

            const elementMatching = new ElementMatching(Array.from(actual));

            for (const elementMatcher of elementMatchers) {
                const result = elementMatching.match(elementMatcher);
                if (!result.isMatch) {
                    return result;
                }
            }

            return elementMatching.matchNoneUnmatched();
        },
    };
}

interface ElementStatus {
    element: unknown;
    isMatched: boolean;
}

class ElementMatching {
    private elementStatuses: Array<ElementStatus>;

    constructor(elements: Array<unknown>) {
        this.elementStatuses = elements.map(element => ({element, isMatched: false}));
    }

    public match(elementMatcher: Matcher): Result {
        const mismatches: Array<Failure> = [];

        for (const elementStatus of this.elementStatuses) {
            if (elementStatus.isMatched) {
                mismatches.push(unmatched("already matched"));
            } else {
                const elementResult = elementMatcher.match(elementStatus.element);
                if (elementResult.isMatch) {
                    elementStatus.isMatched = true;
                    return matched();
                } else {
                    mismatches.push(elementResult);
                }
            }
        }
        if (this.elementStatuses.length === 0) {
            return unmatched("iterable was empty");
        } else {
            return unmatched(
                `was missing element:${indentedList([elementMatcher.describe()])}\n` +
                "These elements were in the iterable but did not match the missing element:" +
                indentedList(this.elementStatuses.map(
                    ({element}, elementIndex) => `${describeValue(element)}: ${mismatches[elementIndex].explanation}`
                )),
            );
        }
    }

    public matchNoneUnmatched(): Result {
        const allMatched = this.elementStatuses.every(status => status.isMatched);
        if (allMatched) {
            return matched();
        } else {
            const unmatchedElementDescriptions = this.elementStatuses
                .filter(status => !status.isMatched)
                .map(status => describeValue(status.element));

            return unmatched(`had extra elements:${indentedList(unmatchedElementDescriptions)}`);
        }
    }
}

function isArrayLike(value: unknown): value is ArrayLike<unknown> {
    return typeof value === "object" && value != null && typeof (value as any).length === "number";
}

function isIterable(value: unknown): value is Iterable<unknown> {
    return typeof value === "object" && value != null && typeof (value as any)[Symbol.iterator] != null;
}
