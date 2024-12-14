import {
    XMLValidator,

    type X2jOptions,
} from "fast-xml-parser";

import { Parser } from "./parser";

import type {
    IRootNode,
} from "@/bookmark/node";

export class NetscapeValidationError extends Error {}

export class NetscapeParseError extends Error {}

export class NetscapeParser extends Parser {
    public static override readonly XMLParserOptions = {
        preserveOrder: true,
        textNodeName: "$text",
        attributeNamePrefix: "",
        attributesGroupName: false,
        // attributesGroupName: "$attrs",
        ignoreAttributes: false,
        removeNSPrefix: true,
        allowBooleanAttributes: false,
        parseTagValue: false,
        parseAttributeValue: false,
        trimValues: true,
        cdataPropName: false,
        commentPropName: false,
        unpairedTags: [
            "DT",
            "HR",
            "META",
            "p",
        ],
        alwaysCreateTextNode: false,
        processEntities: true,
        htmlEntities: true,
        ignoreDeclaration: true,
        ignorePiTags: false,
        transformTagName: false,
        transformAttributeName: false,
    } as const satisfies X2jOptions;

    constructor(parserOptions: X2jOptions = NetscapeParser.XMLParserOptions) {
        super(parserOptions);
    }

    public parse(html: string): IRootNode {
        const validate_result = XMLValidator.validate(html, this.validationOptions);
        if (validate_result !== true) {
            const error = new NetscapeValidationError(validate_result.err.msg);
            error.cause = validate_result.err;
            throw error;
        }

        const xml_objects = this.parser.parse(html);
        const netscape_object = this._getNetscapeXmlObject(xml_objects);
        const root = this._getNetscapeRootNode(netscape_object);
        return root;
    }

    private _getNetscapeXmlObject(_objects: any): any {
        // TODO: Implement
    }

    private _getNetscapeRootNode(_netscape: any): any {
        // TODO: Implement
    }
}
