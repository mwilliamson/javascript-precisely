export function indentedList(
    items: Array<string>,
    bullet: (index: number) => string = () => "*",
): string {
    return items.map((item, itemIndex) => {
        const prefix = ` ${bullet(itemIndex)} `;
        return `\n${prefix}${indent(item, prefix.length)}`;
    }).join("");
}

export function indexedIndentedList(items: Array<string>): string {
    return indentedList(items, index => `${index}:`);
}

export function indent(text: string, width: number = 2): string {
    return text.replace(/\n/g, "\n" + " ".repeat(width));
}
