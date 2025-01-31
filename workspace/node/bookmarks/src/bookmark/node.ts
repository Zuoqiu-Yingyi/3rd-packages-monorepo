import type { TXmlAttrs } from "./xml";

export enum NodeType {
    ROOT = "root",
    FOLDER = "folder",
    BOOKMARK = "bookmark",
    SEPARATOR = "separator",
    ALIAS = "alias",
}

export type TItemNode =
    | IAliasNode
    | IBookmarkNode
    | IFolderNode
    | ISeparatorNode;

export type TItemAttrs =
    & IBookmarkAttrs
    & IFolderAttrs
    & ISeparatorAttrs
    & Record<string, string>;

export type TItemAttr =
    | IBookmarkAttrs
    | IFolderAttrs
    | ISeparatorAttrs
    | Record<string, string>;

export interface IBaseNode {
    type: NodeType;
}

export interface IItemNode extends IBaseNode {
    /**
     * XBEL: `<title>$0</title>`
     *
     * Netscape:
     * - root: `<H1>$0</H1>`
     * - folder: `<H3>$0</H3>`
     * - bookmark: `<A>$0</A>`
     */
    text: string;

    /**
     * XBEL: `<info>$0</info>`
     */
    info?: IInfo;
}

export interface IItemAttrs {
    /**
     * XBEL:
     * - root: `<xbel id="$0">`
     * - folder: `<folder id="$0">`
     * - bookmark: `<bookmark id="$0">`
     *
     * Netscape:
     * - folder: `<H3 ID="$0">`
     * - bookmark: `<A ID="$0">`
     */
    id?: string;

    /**
     * XBEL: CDATA (ISO 8601)
     * - root: `<xbel added="$0">`
     * - folder: `<folder added="$0">`
     * - bookmark: `<bookmark added="$0">`
     *
     * Netscape: Unix timestamp (seconds)
     * - folder: `<H3 ADD_DATE="$0">`
     * - bookmark: `<A ADD_DATE="$0">`
     */
    added?: Date;

    /**
     * XBEL: `<desc>$0</desc>`
     *
     * Netscape:
     * - folder: `<H3 DESCRIPTION="$0">`
     * - bookmark: `<A DESCRIPTION="$0">`
     */
    desc?: string;
}

export interface IRootAttrs extends IItemAttrs {
    /**
     * Netscape:
     * - root: `<title>$0</title>`
     */
    title?: string;

    /**
     * XBEL:
     * - root: `<xbel version="1.0">`
     */
    version?: "1.0";
}

export interface IFolderAttrs extends IItemAttrs {
    /**
     * Netscape: Unix timestamp (seconds)
     * - folder: `<H3 LAST_MODIFIED="$0">`
     */
    modified?: Date;

    /**
     * XBEL:
     * - folder: "yes" | "no"
     */
    folded?: boolean;
}

export interface IBookmarkAttrs extends IItemAttrs {
    /**
     * XBEL: URL
     * - bookmark: `<bookmark href="$0">`
     *
     * Netscape: URL
     * - bookmark: `<A HREF="$0">`
     */
    href: string;

    /**
     * XBEL: CDATA (ISO 8601)
     * - bookmark: `<bookmark modified="$0">`
     *
     * Netscape: Unix timestamp (seconds)
     * - bookmark: `<A LAST_MODIFIED="$0">`
     */
    modified?: Date;

    /**
     * XBEL: CDATA (ISO 8601)
     * - bookmark: `<bookmark visited="$0">`
     */
    visited?: Date;

    /**
     * Netscape: URL
     * - bookmark: `<A ICON_URI="$0">`
     */
    icon_url?: string;

    /**
     * Netscape: data-url
     * - bookmark: `<A ICON="$0">`
     */
    icon?: string;

    /**
     * Netscape:
     * - bookmark: `<A NICKNAME="$0">`
     */
    nickname?: string;

    /**
     * Multiple tags separated by commas `,`
     *
     * Netscape:
     * - bookmark: `<A tags="$0">`
     */
    tags?: string;

    /**
     * A keyword that can be used to open bookmark directly from the address bar
     *
     * Netscape:
     * - bookmark: `<A SHORTCUTURL="$0">`
     */
    shortcut_url?: string;
}

export interface ISeparatorAttrs extends IItemAttrs {
    modified?: Date;
}

export interface IAliasAttrs {
    /**
     * to reference the ID of other node
     *
     * XBEL: `<alias ref="$0">`
     */
    ref: string;
}

export interface IRootNode extends IItemNode {
    type: NodeType.ROOT;
    attrs: IRootAttrs & Record<string, string>;
    children: TItemNode[];
}

export interface IFolderNode extends IItemNode {
    type: NodeType.FOLDER;
    attrs: IFolderAttrs & Record<string, string>;
    children: TItemNode[];
}

export interface IBookmarkNode extends IItemNode {
    type: NodeType.BOOKMARK;
    attrs: IBookmarkAttrs & Record<string, string>;
}

export interface ISeparatorNode extends IBaseNode {
    type: NodeType.SEPARATOR;
    attrs: ISeparatorAttrs & Record<string, string>;
}

export interface IAliasNode extends IBaseNode {
    type: NodeType.ALIAS;
    attrs: IAliasAttrs & Record<string, string>;
}

export interface IInfo {
    metadata: IMetadata[];
}

export interface IMetadata {
    owner: string;
}

export function nodeAttrs2XmlAttrs<T extends TXmlAttrs>(attrs: TItemAttr): T {
    const xmlAttrs: Record<string, string> = {};
    for (const [key, value] of Object.entries(attrs)) {
        switch (true) {
            case value instanceof Date:
                xmlAttrs[key] = value.toISOString();
                break;
            case value === null:
                xmlAttrs[key] = "";
                break;
            case value === undefined:
                break;
            default:
                xmlAttrs[key] = value;
                break;
        }
    }
    return xmlAttrs as T;
}
