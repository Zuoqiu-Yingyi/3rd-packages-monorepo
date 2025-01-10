import {
    XMLBuilder,
    type XmlBuilderOptions,
} from "fast-xml-parser";

import type { IRootNode } from "@/bookmark/node";

export abstract class Builder {
    public static readonly XMLBuilderOptions: XmlBuilderOptions;

    public readonly builder: InstanceType<typeof XMLBuilder>;

    constructor(builderOptions: XmlBuilderOptions) {
        this.builder = new XMLBuilder(builderOptions);
    };

    public abstract build(rootNode: IRootNode): string;
}
