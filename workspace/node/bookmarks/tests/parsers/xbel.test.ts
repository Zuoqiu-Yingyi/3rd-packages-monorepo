import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import bookmarks_example_xbel_node_json from "~/data/bookmarks-example.xbel-node.json";
import bookmarks_example_xbel_xml_json from "~/data/bookmarks-example.xbel-xml.json";
import bookmarks_floccus_xbel_node_json from "~/data/bookmarks-floccus.xbel-node.json";
import bookmarks_floccus_xbel_xml_json from "~/data/bookmarks-floccus.xbel-xml.json";

import { XBELParser } from "@/parsers/xbel";

function traverseObject(obj: any) {
    if (Array.isArray(obj)) {
        obj.forEach((value) => {
            traverseObject(value);
        });
    }
    else if (typeof obj === "object") {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                switch (key) {
                    case "added":
                    case "visited":
                    case "modified":
                        obj[key] = new Date(value);
                        break;
                    default:
                        break;
                }
                traverseObject(value);
            }
        }
    }
}

traverseObject(bookmarks_example_xbel_node_json);
traverseObject(bookmarks_floccus_xbel_node_json);

describe("xbel parser test", async () => {
    const parser = new XBELParser();
    it(`example.xbel`, async () => {
        const bookmarks_xml = await readFile("./data/bookmarks-example.xbel", "utf-8");

        const bookmarks_xml_objects = parser.parser.parse(bookmarks_xml);
        // console.log(JSON.stringify(bookmarks, null, 4));
        expect(
            bookmarks_xml_objects,
            "XML objects",
        ).toEqual(bookmarks_example_xbel_xml_json);

        const bookmarks = parser.parse(bookmarks_xml);
        // console.log(JSON.stringify(bookmarks, null, 4));
        expect(
            bookmarks,
            "XML parse result",
        ).toEqual(bookmarks_example_xbel_node_json);
    });

    it(`bookmarks-floccus.xbel`, async () => {
        const bookmarks_xml = await readFile("./data/bookmarks-floccus.xbel", "utf-8");

        const bookmarks_xml_objects = parser.parser.parse(bookmarks_xml);
        // console.log(JSON.stringify(bookmarks, null, 4));
        expect(
            bookmarks_xml_objects,
            "XML objects",
        ).toEqual(bookmarks_floccus_xbel_xml_json);

        const bookmarks = parser.parse(bookmarks_xml);
        // console.log(JSON.stringify(bookmarks, null, 4));
        expect(
            bookmarks,
            "XML parse result",
        ).toEqual(bookmarks_floccus_xbel_node_json);
    });
});
