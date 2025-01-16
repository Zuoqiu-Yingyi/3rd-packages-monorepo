import {
    nodeAttrs2XmlAttrs,
    NodeType,
    type IBaseNode,
    type IBookmarkNode,
    type IFolderNode,
    type IRootNode,
    type ISeparatorNode,
} from "@/bookmark/node";

import { Builder } from "./builder";

import type {
    XmlBuilderOptions,
} from "fast-xml-parser";

import type {
    IXbelBookmarkNode,
    IXbelFolderNode,
    IXbelMetadataNode,
    IXbelNode,
    TXbelItemInfoNode,
    TXbelItemNode,
    TXbelItemNodeChildren,
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
        suppressUnpairedNode: false,
        suppressBooleanAttributes: false,
        preserveOrder: true,
        unpairedTags: [
            "metadata",
            "separator",
        ],
        stopNodes: [],
        processEntities: false,
        oneListGroup: false,
    } as const satisfies XmlBuilderOptions;

    constructor(builderOptions: XmlBuilderOptions = {}) {
        super({
            ...XBELBuilder.XMLBuilderOptions,
            ...builderOptions,
        });
    }

    public build(rootNode: IRootNode): string {
        const xbel_node = this._getXbelItemNode(rootNode) as IXbelNode;
        return [
            `<?xml version="1.0" encoding="UTF-8"?>`,
            `<!DOCTYPE xbel PUBLIC "+//IDN python.org//DTD XML Bookmark Exchange Language 1.0//EN//XML" "http://pyxml.sourceforge.net/topics/dtds/xbel-1.0.dtd">`,
            this.builder.build([xbel_node]),
        ].join("\n");
    }

    private _getXbelItemNode(node: IBaseNode): IXbelNode | TXbelItemNode | undefined {
        const children: TXbelItemNodeChildren[] = [];

        switch (node.type) {
            case NodeType.SEPARATOR: {
                const _node = node as ISeparatorNode;
                return {
                    separator: [],
                    ":@": nodeAttrs2XmlAttrs({
                        id: _node.attrs.id,
                        added: _node.attrs.added,
                        modified: _node.attrs.modified,
                    }),
                };
            }
            case NodeType.ALIAS:
                return;
            default:
                break;
        }

        // <title>, <info>, <desc>
        switch (node.type) {
            case NodeType.ROOT:
            case NodeType.FOLDER:
            case NodeType.BOOKMARK: {
                const _node = node as IBookmarkNode | IFolderNode | IRootNode;

                // <title>
                children.push({
                    title: [{ $text: _node.text ?? "" }],
                });

                // <info>
                if (_node.info) {
                    children.push({
                        info: _node.info.metadata.map<IXbelMetadataNode>((metadata) => ({
                            metadata: [],
                            ":@": {
                                owner: metadata.owner,
                            },
                        })),
                    });
                }

                // <desc>
                if (_node.attrs.desc != null) {
                    children.push({
                        desc: [{ $text: _node.attrs.desc }],
                    });
                }
                break;
            }
            default:
                break;
        }

        // children
        switch (node.type) {
            case NodeType.ROOT:
            case NodeType.FOLDER: {
                const _node = node as IFolderNode | IRootNode;
                children.push(..._node.children.map((child) => this._getXbelItemNode(child) as TXbelItemNode));
                break;
            }
            default:
                break;
        }

        switch (node.type) {
            case NodeType.ROOT: {
                const _node = node as IRootNode;
                return {
                    xbel: children,
                    ":@": nodeAttrs2XmlAttrs({
                        version: _node.attrs.version ?? "1.0",

                        id: _node.attrs.id,
                        added: _node.attrs.added,
                        title: _node.attrs.title,
                    }),
                } satisfies IXbelNode;
            }
            case NodeType.FOLDER: {
                const _node = node as IFolderNode;
                return {
                    folder: children,
                    ":@": nodeAttrs2XmlAttrs({
                        id: _node.attrs.id,
                        added: _node.attrs.added,
                        modified: _node.attrs.modified,
                        folded: _node.attrs.folded != null
                            ? (_node.attrs.folded ? "yes" : "no")
                            : undefined,
                    }),
                } satisfies IXbelFolderNode;
            }
            case NodeType.BOOKMARK:{
                const _node = node as IBookmarkNode;
                return {
                    bookmark: children as TXbelItemInfoNode[],
                    ":@": nodeAttrs2XmlAttrs<NonNullable<IXbelBookmarkNode[":@"]>>({
                        href: _node.attrs.href,

                        id: _node.attrs.id,
                        added: _node.attrs.added,
                        modified: _node.attrs.modified,
                        visited: _node.attrs.visited,
                        icon_url: _node.attrs.icon_url,
                        icon: _node.attrs.icon,
                        nickname: _node.attrs.nickname,
                        tags: _node.attrs.tags,
                        shortcut_url: _node.attrs.shortcut_url,
                    }),
                } satisfies IXbelBookmarkNode;
            }
            default:
                break;
        }

        return undefined;
    }
}
