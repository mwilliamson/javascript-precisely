import { matched, Matcher, unmatched } from "./core";
import { describeValue } from "./describeValue";

export function startsWith(value: string): Matcher {
    return {
      describe() {
        return `starts with: ${describeValue(value)}`;
      },
  
      match(actual: unknown) {
        const actualStr = actual as string;
        if ((typeof actual)  !== "string" || !actualStr.startsWith(value)) {
            return unmatched(`was ${describeValue(actual)}`);
        } else {
            return matched();
        }
      },
    };
  }