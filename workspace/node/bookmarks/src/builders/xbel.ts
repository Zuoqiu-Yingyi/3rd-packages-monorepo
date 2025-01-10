import { Builder } from "./builder";

import type {
    XmlBuilderOptions,
} from "fast-xml-parser";

import type {
    IRootNode,
} from "@/bookmark/node";

import type {
    IXbelNode,
    TXbelItemNodeChildren,
    TXbelXmlNodes,
} from "./../bookmark/xbel";

export class XBELBuilder extends Builder {
    public static override readonly XMLBuilderOptions = {
        attributeNamePrefix: "",
        attributesGroupName: false,
        textNodeName: "$text",
        ignoreAttributes: false,
        cdataPropName: false,
        commentPropName: false,
        format: true,
        indentBy: "  ",
        arrayNodeName: undefined,
        suppressEmptyNode: false,
        suppressUnpairedNode: true,
        suppressBooleanAttributes: false,
        preserveOrder: true,
        unpairedTags: [],
        stopNodes: [],
        processEntities: false,
        oneListGroup: false,
    } as const satisfies XmlBuilderOptions;

    constructor(builderOptions: XmlBuilderOptions = XBELBuilder.XMLBuilderOptions) {
        super(builderOptions);
    }

    public build(rootNode: IRootNode): string {
        const jObj = this._getXbelXmlNodes(rootNode);
        return this.builder.build(jObj);
    }

    private _getXbelXmlNodes(rootNode: IRootNode): TXbelXmlNodes {
        const nodes: TXbelXmlNodes = [
            {
                "?xml": [
                    {
                        $text: "",
                    },
                ],
                ":@": {
                    version: "1.0",
                    encoding: "UTF-8",
                },
            },
            {
                $text: "<!DOCTYPE xbel PUBLIC \"+//IDN python.org//DTD XML Bookmark Exchange Language 1.0//EN//XML\" \"http://pyxml.sourceforge.net/topics/dtds/xbel.dtd\">",
            },
            this._getXbelXmlNode(rootNode),
        ];
        return nodes;
    }

    private _getXbelXmlNode(_rootNode: IRootNode): IXbelNode {
        const nodes: TXbelItemNodeChildren[] = [];
        // TODO: root-node -> xbel-nodes
        return {
            xbel: nodes,
            ":@": {
                version: "1.0",
            },
        };
    }
}
