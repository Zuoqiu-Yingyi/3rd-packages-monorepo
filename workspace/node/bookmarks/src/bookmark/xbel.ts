import type {
    IXmlLeafNode,
    IXmlNode,
    TXmlAttrs,
} from "./xml";

export enum XbelTagName {
    XBEL = "xbel",
    ALIAS = "alias",
    BOOKMARK = "bookmark",
    DESC = "desc",
    FOLDER = "folder",
    INFO = "info",
    METADATA = "metadata",
    SEPARATOR = "separator",
    TITLE = "title",
}

export type TXbelItemNode =
    | IXbelAliasNode
    | IXbelBookmarkNode
    | IXbelFolderNode
    | IXbelSeparatorNode;

export type TXbelItemNodeChildren = TXbelItemInfoNode | TXbelItemNode;

export type TXbelItemInfoNode =
    | IXbelDescNode
    | IXbelInfoNode
    | IXbelTitleNode;

export type TFolded = "no" | "yes";

export interface IXbelItemAttrs extends TXmlAttrs {
    id?: string;
    added?: string;
}

export interface IXbelUrlAttrs extends TXmlAttrs {
    href: string;
    visited?: string;
    modified?: string;
}

export interface IValidationOptions {
    allowBooleanAttributes?: boolean;
    unpairedTags?: string[];
}

export interface IXbelTitleNode extends IXmlNode {
    title: [IXmlLeafNode];
}

export interface IXbelDescNode extends IXmlNode {
    desc: [IXmlLeafNode];
}

export interface IXbelMetadataNode extends IXmlNode {
    metadata: [];
    ":@": {
        owner: string;
    };
}

export interface IXbelInfoNode extends IXmlNode {
    info: IXbelMetadataNode[];
}

export interface IXbelAliasNode extends IXmlNode {
    alias: [];
    ":@": {
        ref: string;
    };
}

export interface IXbelSeparatorNode extends IXmlNode {
    separator: [];
}

export interface IXbelBookmarkNode extends IXmlNode {
    bookmark: TXbelItemInfoNode[];
    ":@": IXbelItemAttrs & IXbelUrlAttrs;
}

export interface IXbelFolderNode extends IXmlNode {
    folder: TXbelItemNodeChildren[];
    ":@": IXbelItemAttrs & {
        folded?: TFolded;
    };
}

export interface IXbelNode extends IXmlNode {
    xbel: TXbelItemNodeChildren[];
    ":@": IXbelItemAttrs & {
        version?: "1.0";
    };
}
