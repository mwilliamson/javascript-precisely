export function indentedList(items: Array<string>): string {
    return items.map(item => {
        const prefix = " * ";
        return `\n${prefix}${indent(item, prefix.length)}`;
    }).join("");
}

export function indent(text: string, width: number = 2): string {
    return text.replace(/\n/g, "\n" + " ".repeat(width));
}
