import {
    XMLParser,
    type X2jOptions,
} from "fast-xml-parser";

import type { IRootNode } from "@/bookmark/node";

export abstract class Parser {
    public static readonly XMLParserOptions: X2jOptions;

    public readonly parser: InstanceType<typeof XMLParser>;
    public readonly validationOptions: Pick<X2jOptions, "allowBooleanAttributes" | "unpairedTags">;

    constructor(parserOptions: X2jOptions) {
        this.parser = new XMLParser(parserOptions);
        this.validationOptions = {
            allowBooleanAttributes: parserOptions.allowBooleanAttributes,
            unpairedTags: parserOptions.unpairedTags,
        };
    };

    public abstract parse(xmlData: string): IRootNode;
}
