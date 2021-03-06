import { Failure, Matcher, Result, matched, unmatched } from "./core";
import { describeValue } from "./describeValue";
import { indentedList, indexedIndentedList } from "./formatting";
import { toMatcher } from "./toMatcher";

export function containsExactly(...valuesOrMatchers: Array<unknown>): Matcher {
    const elementMatchers = valuesOrMatchers.map(matcherOrValue => toMatcher(matcherOrValue));

    return {
        describe() {
            const elementMatchersDescription = indentedList(
                elementMatchers.map(elementMatcher => elementMatcher.describe()),
            );
            if (elementMatchers.length === 0) {
                return emptyIterableDescription;
            } else if (elementMatchers.length === 1) {
                return `iterable containing 1 element:${elementMatchersDescription}`;
            } else {
                return `iterable containing these ${elementMatchers.length} elements in any order:${elementMatchersDescription}`;
            }
        },

        match(actual: unknown) {
            return matchIncludes(elementMatchers, actual, {allowExtra: false});
        },
    };
}

export function includes(...valuesOrMatchers: Array<unknown>): Matcher {
    const elementMatchers = valuesOrMatchers.map(matcherOrValue => toMatcher(matcherOrValue));

    return {
        describe() {
            const elementMatchersDescription = indentedList(
                elementMatchers.map(elementMatcher => elementMatcher.describe()),
            );
            return `iterable including elements:${elementMatchersDescription}`;
        },

        match(actual: unknown) {
            return matchIncludes(elementMatchers, actual, {allowExtra: true});
        },
    };
}

function matchIncludes(elementMatchers: Array<Matcher>, actual: unknown, {allowExtra}: {allowExtra: boolean}): Result {
    if (!isArrayish(actual)) {
        return unmatchedArrayish(actual);
    }

    const elementMatching = new ElementMatching(Array.from(actual));

    for (const elementMatcher of elementMatchers) {
        const result = elementMatching.match(elementMatcher);
        if (!result.isMatch) {
            return result;
        }
    }

    if (allowExtra) {
        return matched();
    } else {
        return elementMatching.matchNoneUnmatched();
    }
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

export function isSequence(...valuesOrMatchers: Array<unknown>): Matcher {
    const elementMatchers = valuesOrMatchers.map(matcherOrValue => toMatcher(matcherOrValue));

    return {
        describe() {
            if (elementMatchers.length === 0) {
                return emptyIterableDescription;
            } else {
                const elementsDescription = indexedIndentedList(
                    elementMatchers.map(elementMatcher => elementMatcher.describe()),
                );
                return `iterable containing in order:${elementsDescription}`
            }
        },

        match(actual: unknown) {
            if (!isArrayish(actual)) {
                return unmatchedArrayish(actual);
            }

            const elements = Array.from(actual);

            if (elements.length === 0 && elementMatchers.length != 0) {
                return unmatched("iterable was empty");
            }

            for (let elementIndex = 0; elementIndex < elementMatchers.length; elementIndex++) {
                const elementMatcher = elementMatchers[elementIndex];
                if (elementIndex >= elements.length) {
                    return unmatched(`element at index ${elementIndex} was missing`);
                }
                const element = elements[elementIndex];

                const elementResult = elementMatcher.match(element);
                if (!elementResult.isMatch) {
                    return unmatched(`element at index ${elementIndex} mismatched:${indentedList([elementResult.explanation])}`);
                }
            }

            if (elements.length > elementMatchers.length) {
                const extraElementsDescription = indentedList(
                    elements
                        .slice(elementMatchers.length)
                        .map(element => describeValue(element)),
                );
                return unmatched(`had extra elements:${extraElementsDescription}`);
            }

            return matched();
        },
    };
}

function isArrayish(actual: unknown): actual is ArrayLike<unknown> | Iterable<unknown> {
    return isArrayLike(actual) || isIterable(actual);
}

function unmatchedArrayish(actual: unknown): Result {
    return unmatched(`was neither iterable nor array-like\nwas ${describeValue(actual)}`);
}

const emptyIterableDescription = "empty iterable";

function isArrayLike(value: unknown): value is ArrayLike<unknown> {
    return typeof value === "object" && value != null && typeof (value as any).length === "number";
}

function isIterable(value: unknown): value is Iterable<unknown> {
    return typeof value === "object" && value != null && typeof (value as any)[Symbol.iterator] != null;
}
