import { inspect } from "util";

export function describeValue(value: unknown): string {
    return inspect(value);
}
