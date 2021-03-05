import { Matcher, matched } from "./core";

export const anything: Matcher = {
    describe() {
        return "anything";
    },

    match(value: unknown) {
        return matched();
    },
};
