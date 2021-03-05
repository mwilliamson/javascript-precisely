export type Result =
    | {isMatch: false, explanation: string}
    | {isMatch: true};

export function matched(): Result {
    return {isMatch: true};
}

export function unmatched(explanation: string): Result {
    return {isMatch: false, explanation: explanation};
}

export interface Matcher {
    describe: () => string;
    match: (actual: unknown) => Result;
}
