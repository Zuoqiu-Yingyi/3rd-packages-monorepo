import type {
    IXmlLeafNode,
    IXmlNode,
    TXmlAttrs,
} from "./xml";

export enum NetscapeTagName {
    A = "A",
    DL = "DL",
    DT = "DT",
    H1 = "H1",
    H3 = "H3",
    HR = "HR",
    META = "META",
    TITLE = "TITLE",
    p = "p",
}

export type TNetscapeItemNode =
    | INetscapeANode
    | INetscapeDLNode
    | INetscapeDTNode
    | INetscapeH3Node
    | INetscapeHRNode
    | INetscapePNode;

export interface INetscapeItemAttrs extends TXmlAttrs {
    ID?: string;
    ADD_DATE?: string;
    LAST_MODIFIED?: string;
}

export interface INetscapeBookmarkAttrs extends INetscapeItemAttrs {
    ICON_URI?: string;
    ICON?: string;
    NICKNAME?: string;
    DESCRIPTION?: string;
    SHORTCUTURL?: string;
    TAGS?: string;
}

export interface INetscapeANode extends IXmlNode {
    [NetscapeTagName.A]: [IXmlLeafNode];
    ":@"?: INetscapeBookmarkAttrs;
}

export interface INetscapeDLNode extends IXmlNode {
    [NetscapeTagName.DL]: TNetscapeItemNode[];
}

export interface INetscapeDTNode extends IXmlNode {
    [NetscapeTagName.DT]: [];
}

export interface INetscapeH1Node extends IXmlNode {
    [NetscapeTagName.H1]: [IXmlLeafNode];
}

export interface INetscapeH3Node extends IXmlNode {
    [NetscapeTagName.H3]: [IXmlLeafNode];
    ":@"?: INetscapeItemAttrs;
}

export interface INetscapeHRNode extends IXmlNode {
    [NetscapeTagName.HR]: [IXmlLeafNode];
    ":@"?: INetscapeItemAttrs;
}

export interface INetscapeMetaNode extends IXmlNode {
    [NetscapeTagName.META]: [];
    ":@"?: {
        "HTTP-EQUIV": string;
        CONTENT: string;
    };
}

export interface INetscapeTitleNode extends IXmlNode {
    [NetscapeTagName.TITLE]: [IXmlLeafNode];
}

export interface INetscapePNode extends IXmlNode {
    [NetscapeTagName.p]: [];
}
