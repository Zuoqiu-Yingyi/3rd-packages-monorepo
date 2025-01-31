import {
    readFile,
} from "node:fs/promises";

import {
    describe,
    expect,
    it,
} from "vitest";

import { XBELParser } from "@/parsers/xbel";

import { deserializeObject } from "./../utils";

describe("xbel parser test", async () => {
    const parser = new XBELParser();
    it(`bookmarks-example.xbel`, async () => {
        const bookmarks_xml = await readFile("./data/bookmarks-example.xbel", "utf-8");

        /* XML objects */
        const bookmarks_xml_objects = parser.parser.parse(bookmarks_xml);

        // console.log(JSON.stringify(bookmarks_xml_objects, null, 4));
        // await writeFile("./data/bookmarks-example.xbel-xml.json", `${JSON.stringify(bookmarks_xml_objects, null, 4)}\n`);

        const { default: bookmarks_example_xbel_xml_json } = await import("~/data/bookmarks-example.xbel-xml.json");
        expect(
            bookmarks_xml_objects,
            "XML objects",
        ).toEqual(bookmarks_example_xbel_xml_json);

        /* XML parse result */
        const bookmarks = parser.parse(bookmarks_xml);

        // console.log(JSON.stringify(bookmarks, null, 4));
        // await writeFile("./data/bookmarks-example.xbel-node.json", `${JSON.stringify(bookmarks, null, 4)}\n`);

        const { default: bookmarks_example_xbel_node_json } = await import("~/data/bookmarks-example.xbel-node.json");
        deserializeObject(bookmarks_example_xbel_node_json);
        expect(
            bookmarks,
            "XML parse result",
        ).toEqual(bookmarks_example_xbel_node_json);
    });

    it(`bookmarks-floccus.xbel`, async () => {
        const bookmarks_xml = await readFile("./data/bookmarks-floccus.xbel", "utf-8");

        /* XML objects */
        const bookmarks_xml_objects = parser.parser.parse(bookmarks_xml);

        // console.log(JSON.stringify(bookmarks_xml_objects, null, 4));
        // await writeFile("./data/bookmarks-floccus.xbel-xml.json", `${JSON.stringify(bookmarks_xml_objects, null, 4)}\n`);

        const { default: bookmarks_floccus_xbel_xml_json } = await import("~/data/bookmarks-floccus.xbel-xml.json");
        expect(
            bookmarks_xml_objects,
            "XML objects",
        ).toEqual(bookmarks_floccus_xbel_xml_json);

        /* XML parse result */
        const bookmarks = parser.parse(bookmarks_xml);

        // console.log(JSON.stringify(bookmarks, null, 4));
        // await writeFile("./data/bookmarks-floccus.xbel-node.json", `${JSON.stringify(bookmarks, null, 4)}\n`);

        const { default: bookmarks_floccus_xbel_node_json } = await import("~/data/bookmarks-floccus.xbel-node.json");
        deserializeObject(bookmarks_floccus_xbel_node_json);
        expect(
            bookmarks,
            "XML parse result",
        ).toEqual(bookmarks_floccus_xbel_node_json);
    });
});
