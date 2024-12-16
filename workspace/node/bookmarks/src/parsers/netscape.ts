import {
    NetscapeTagName,
    type INetscapeANode,
    type INetscapeBookmarkAttrs,
    type INetscapeDLNode,
    type INetscapeH3Node,
    type INetscapeHRNode,
    type INetscapeItemAttrs,
} from "@/bookmark/netscape";
import {
    NodeType,
    type IBookmarkNode,
    type IFolderNode,
    type IRootNode,
    type ISeparatorNode,
    type TItemAttrs,
    type TItemNode,
} from "@/bookmark/node";
import {
    filterXmlNodeWithTagName,
    findXmlNodeWithTagName,
    getXmlNodeText,
    type IXmlNode,
} from "@/bookmark/xml";

import { VIVALDI_SEPARATOR_HREF } from "../bookmark";
import { Parser } from "./parser";

import type {
    X2jOptions,
} from "fast-xml-parser";

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
        const xml_objects = this.parser.parse(html);
        const root = this._getRootNode(xml_objects);
        return root;
    }

    private _getRootNode(xmlNodes: IXmlNode[]): IRootNode {
        const title = this._getXmlText(xmlNodes, NetscapeTagName.TITLE);
        const h1 = this._getXmlText(xmlNodes, NetscapeTagName.H1);
        const dl_node = this._getNetscapeDLNode(xmlNodes);
        const root: IRootNode = {
            type: NodeType.ROOT,
            text: h1 ?? title ?? "",
            attrs: {
                title: title ?? h1 ?? "",
            },
            children: dl_node ? this._getItems(dl_node) : [],
        };
        return root;
    }

    private _getXmlText(xmlNodes: IXmlNode[], tagName: string): string | undefined {
        const title_node = findXmlNodeWithTagName(xmlNodes, tagName);
        if (title_node) {
            return getXmlNodeText(title_node);
        }
        return undefined;
    }

    private _getNetscapeDLNode(xmlNodes: IXmlNode[]): INetscapeDLNode | undefined {
        const xbel_objects = filterXmlNodeWithTagName<INetscapeDLNode>(xmlNodes, NetscapeTagName.DL);
        if (xbel_objects.length < 1) {
            throw new NetscapeParseError("Netscape root node not found");
        }

        if (xbel_objects.length > 1) {
            throw new NetscapeParseError("Multiple Netscape root nodes found");
        }

        return xbel_objects[0]!;
    }

    private _getItems(dlNode: INetscapeDLNode): TItemNode[] {
        const items: TItemNode[] = [];
        const dl_children = dlNode.DL;
        for (let i = 0; i < dl_children.length; i++) {
            const node = dl_children[i]!;
            switch (true) {
                case NetscapeTagName.A in node: {
                    const a_node = node as INetscapeANode;
                    const a_attrs = a_node[":@"];
                    const bookmark_attrs = a_attrs
                        ? this._getItemNodeAttrs(a_attrs) as IBookmarkNode["attrs"]
                        : { href: "" };
                    if (bookmark_attrs.href === VIVALDI_SEPARATOR_HREF) { // Vivaldi separator
                        const separator: ISeparatorNode = {
                            type: NodeType.SEPARATOR,
                            attrs: bookmark_attrs,
                        };
                        items.push(separator);
                    }
                    else {
                        const bookmark: IBookmarkNode = {
                            type: NodeType.BOOKMARK,
                            text: getXmlNodeText(a_node.A) ?? "",
                            attrs: bookmark_attrs,
                        };
                        items.push(bookmark);
                    }
                    break;
                }
                case NetscapeTagName.H3 in node: {
                    const next_node = dl_children.at(i + 1);
                    if (next_node && NetscapeTagName.DL in next_node) {
                        const h3_node = node as INetscapeH3Node;
                        const h3_attrs = h3_node[":@"];
                        const dl_node = next_node as INetscapeDLNode;

                        const folder: IFolderNode = {
                            type: NodeType.FOLDER,
                            text: getXmlNodeText(h3_node.H3) ?? "",
                            attrs: h3_attrs
                                ? this._getItemNodeAttrs(h3_attrs) as IFolderNode["attrs"]
                                : {},
                            children: this._getItems(dl_node),
                        };
                        items.push(folder);
                    }
                    break;
                }
                case NetscapeTagName.HR in node: { // Firefox separator
                    const hr_node = node as INetscapeHRNode;
                    const hr_attrs = hr_node[":@"];
                    const separator: ISeparatorNode = {
                        type: NodeType.SEPARATOR,
                        attrs: hr_attrs
                            ? this._getItemNodeAttrs(hr_attrs) as ISeparatorNode["attrs"]
                            : {},
                    };
                    items.push(separator);
                    break;
                }
                default:
                    break;
            }
        }
        return items;
    }

    private _getItemNodeAttrs(attrs: INetscapeBookmarkAttrs | INetscapeItemAttrs): TItemAttrs {
        return Object.entries(attrs).reduce<TItemAttrs>((attrs, [key, value]) => {
            switch (key) {
                case "ID":
                    attrs.id = value as string;
                    break;
                case "ADD_DATE":
                    attrs.added = new Date(Number.parseInt(value as string) * 100);
                    break;
                case "LAST_MODIFIED":
                    attrs.modified = new Date(Number.parseInt(value as string) * 100);
                    break;
                case "HREF":
                    attrs.href = value as string;
                    break;
                case "ICON_URI":
                    attrs.icon_url = value as string;
                    break;
                case "ICON":
                    attrs.icon = value as string;
                    break;
                case "NICKNAME":
                    attrs.nickname = value as string;
                    break;
                case "DESCRIPTION":
                    attrs.desc = value as string;
                    break;
                case "SHORTCUTURL":
                    attrs.shortcuturl = value as string;
                    break;
                case "TAGS":
                    attrs.tags = value as string;
                    break;

                default:
                    attrs[key] = value as string;
                    break;
            }
            return attrs;
        }, {} as TItemAttrs);
    }
}
