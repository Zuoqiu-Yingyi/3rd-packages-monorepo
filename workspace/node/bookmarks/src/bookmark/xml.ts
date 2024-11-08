export type TXmlAttrs = Record<string, string | undefined>;

export interface IXmlAttrs {
    ":@"?: TXmlAttrs;
}

export interface IXmlLeafNode extends IXmlAttrs {
    $text?: string;
}

export interface IXmlNode extends IXmlAttrs {
    [tagName: string]: (IXmlLeafNode | IXmlNode)[] | IXmlAttrs[":@"];
}

export function findXmlNodeWithTagName<T extends IXmlNode = IXmlNode>(xmlNodes: IXmlNode[], tagName: string): T | undefined {
    return xmlNodes.find((node) => tagName in node) as T;
}

export function filterXmlNodeWithTagName<T extends IXmlNode = IXmlNode>(xmlNodes: IXmlNode[], tagName: string): T[] {
    return xmlNodes.filter((node) => tagName in node) as T[];
}

export function getXmlNodeText(node: (IXmlLeafNode | IXmlNode)[] | (IXmlLeafNode | IXmlNode)): string | undefined {
    if (Array.isArray(node)) {
        return (node.find((n) => "$text" in n) as IXmlLeafNode).$text;
    }
    else {
        return (node as IXmlLeafNode).$text;
    }
}
