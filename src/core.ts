export type Failure = {isMatch: false, explanation: string};

export type Result =
    | Failure
    | {isMatch: true};

export function matched(): Result {
    return {isMatch: true};
}

export function unmatched(explanation: string): Failure {
    return {isMatch: false, explanation: explanation};
}

export interface Matcher {
    describe: () => string;
    match: (actual: unknown) => Result;
}
