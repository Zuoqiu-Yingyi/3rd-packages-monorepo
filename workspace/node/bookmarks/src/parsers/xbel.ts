import {
    XMLValidator,

    type X2jOptions,
} from "fast-xml-parser";

import {
    NodeType,
    type IBookmarkAttrs,
    type IBookmarkNode,
    type IFolderNode,
    type IInfo,
    type IRootNode,
    type TItemNode,
} from "@/bookmark/node";
import {
    XbelTagName,
    type IXbelBookmarkNode,
    type IXbelFolderNode,
    type IXbelInfoNode,
    type IXbelMetadataNode,
    type IXbelNode,
    type IXbelSeparatorNode,
    type TXbelItemNodeChildren,
} from "@/bookmark/xbel";
import {
    filterXmlNodeWithTagName,
    findXmlNodeWithTagName,
    getXmlNodeText,
} from "@/bookmark/xml";

import { Parser } from "./parser";

export class XBELValidationError extends Error {}

export class XBELParseError extends Error {}

export class XBELParser extends Parser {
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
        unpairedTags: [],
        alwaysCreateTextNode: false,
        processEntities: true,
        htmlEntities: false,
        ignoreDeclaration: true,
        ignorePiTags: false,
        transformTagName: false,
        transformAttributeName: false,
    } as const satisfies X2jOptions;

    constructor(parserOptions: X2jOptions = XBELParser.XMLParserOptions) {
        super(parserOptions);
    }

    public parse(xml: string): IRootNode {
        const validate_result = XMLValidator.validate(xml, this.validationOptions);
        if (validate_result !== true) {
            const error = new XBELValidationError(validate_result.err.msg);
            error.cause = validate_result.err;
            throw error;
        }

        const xml_objects = this.parser.parse(xml);
        const xbel_object = this._getXbelXmlObject(xml_objects);
        const root = this._getXbelRootNode(xbel_object);
        return root;
    }

    /**
     * Get the XBEL root node from the parsed XML object list.
     * @param objects - The parsed XML object list.
     * @returns The XBEL root node.
     */
    private _getXbelXmlObject(objects: any): IXbelNode {
        if (Array.isArray(objects)) {
            const xbel_objects = filterXmlNodeWithTagName<IXbelNode>(objects, XbelTagName.XBEL);
            if (xbel_objects.length < 1) {
                throw new XBELParseError("XBEL root node not found");
            }

            if (xbel_objects.length > 1) {
                throw new XBELParseError("Multiple XBEL root nodes found");
            }

            return xbel_objects[0]!;
        }
        throw new XBELParseError("Invalid XBEL XML");
    }

    private _getXbelRootNode(xbel: IXbelNode): IRootNode {
        const xbel_children = xbel.xbel;
        const xbel_attrs = xbel[":@"];

        const root: IRootNode = {
            type: NodeType.ROOT,
            text: this._getXbelItemTitle(xbel_children) ?? "",
            attrs: Object.entries(xbel_attrs).reduce<Record<string, any>>((attrs, [key, value]) => {
                switch (key) {
                    case "added":
                        attrs[key] = new Date(value as string);
                        break;

                    default:
                        attrs[key] = value;
                        break;
                }
                return attrs;
            }, {}),
            children: this._getItems(xbel_children),
        };

        const desc = this._getXbelItemDesc(xbel_children);
        if (desc != null) {
            root.desc = desc;
        }
        const info = this._getXbelItemInfo(xbel_children);
        if (info != null) {
            root.info = info;
        }

        return root;
    }

    private _getXbelItemTitle(xbelItem: TXbelItemNodeChildren[]): string | undefined {
        const title_node = findXmlNodeWithTagName(xbelItem, XbelTagName.TITLE);
        if (title_node) {
            return getXmlNodeText(title_node);
        }
        return undefined;
    }

    private _getXbelItemDesc(xbelItem: TXbelItemNodeChildren[]): string | undefined {
        const desc_node = findXmlNodeWithTagName(xbelItem, XbelTagName.DESC);
        if (desc_node) {
            return getXmlNodeText(desc_node);
        }
        return undefined;
    }

    private _getXbelItemInfo(xbelItem: TXbelItemNodeChildren[]): IInfo | undefined {
        const info_node = findXmlNodeWithTagName<IXbelInfoNode>(xbelItem, XbelTagName.INFO);
        if (info_node) {
            const metadata_nodes = filterXmlNodeWithTagName<IXbelMetadataNode>(info_node.info, XbelTagName.METADATA);
            return {
                metadata: metadata_nodes.map((metadata_node) => ({ owner: metadata_node[":@"].owner })),
            };
        }
        return undefined;
    }

    private _getItems(xbelItems: TXbelItemNodeChildren[]): TItemNode[] {
        const items: TItemNode[] = [];
        xbelItems.forEach((xbel_item) => {
            Object.keys(xbel_item).forEach((tag_name) => {
                switch (tag_name) {
                    case XbelTagName.ALIAS: {
                        // TODO: Implement reference to another node
                        break;
                    }
                    case XbelTagName.BOOKMARK: {
                        const bookmark_xbel = xbel_item as IXbelBookmarkNode;
                        const bookmark_attrs = bookmark_xbel[":@"];
                        const bookmark_children = bookmark_xbel[tag_name];
                        const bookmark: IBookmarkNode = {
                            type: NodeType.BOOKMARK,
                            text: this._getXbelItemTitle(bookmark_children) ?? "",
                            attrs: Object.entries(bookmark_attrs).reduce<Record<string, any>>((attrs, [key, value]) => {
                                switch (key) {
                                    case "added":
                                    case "visited":
                                    case "modified":
                                        attrs[key] = new Date(value as string);
                                        break;

                                    default:
                                        attrs[key] = value;
                                        break;
                                }
                                return attrs;
                            }, {}) as IBookmarkAttrs & Record<string, string>,
                        };

                        const desc = this._getXbelItemDesc(bookmark_children);
                        if (desc != null) {
                            bookmark.desc = desc;
                        }
                        const info = this._getXbelItemInfo(bookmark_children);
                        if (info != null) {
                            bookmark.info = info;
                        }

                        items.push(bookmark);
                        break;
                    }
                    case XbelTagName.FOLDER: {
                        const folder_xbel = xbel_item as IXbelFolderNode;
                        const folder_attrs = folder_xbel[":@"];
                        const folder_children = folder_xbel[tag_name];
                        const folder: IFolderNode = {
                            type: NodeType.FOLDER,
                            text: this._getXbelItemTitle(folder_children) ?? "",
                            attrs: Object.entries(folder_attrs).reduce<Record<string, any>>((attrs, [key, value]) => {
                                switch (key) {
                                    case "added":
                                        attrs[key] = new Date(value as string);
                                        break;
                                    case "folded":
                                        attrs[key] = !(value === "no");
                                        break;

                                    default:
                                        attrs[key] = value;
                                        break;
                                }
                                return attrs;
                            }, {}),
                            children: this._getItems(folder_children),
                        };

                        const desc = this._getXbelItemDesc(folder_children);
                        if (desc != null) {
                            folder.desc = desc;
                        }
                        const info = this._getXbelItemInfo(folder_children);
                        if (info != null) {
                            folder.info = info;
                        }

                        items.push(folder);
                        break;
                    }
                    case XbelTagName.SEPARATOR: {
                        const separator_xbel = xbel_item as IXbelSeparatorNode;
                        const separator_attrs = separator_xbel[":@"];
                        items.push({
                            type: NodeType.SEPARATOR,
                            attrs: Object.entries(separator_attrs ?? {}).reduce<Record<string, any>>((attrs, [key, value]) => {
                                attrs[key] = value;
                                return attrs;
                            }, {}),
                        });
                        break;
                    }
                    default:
                        break;
                }
            });
        });
        return items;
    }
}
