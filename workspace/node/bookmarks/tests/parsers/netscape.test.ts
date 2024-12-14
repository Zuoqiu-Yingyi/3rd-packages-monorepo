import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import { NetscapeParser } from "@/parsers/netscape";

describe("netscape parser test", async () => {
    const parser = new NetscapeParser();
    it(`example.html`, async () => {
        const bookmarks_xml = await readFile("./data/bookmarks-example.html", "utf-8");

        /* XML objects */
        const bookmarks_xml_objects = parser.parser.parse(bookmarks_xml);

        // console.log(JSON.stringify(bookmarks_xml_objects, null, 4));
        // await writeFile("./data/bookmarks-example.html-xml.json", JSON.stringify(bookmarks_xml_objects, null, 4));

        const { default: bookmarks_example_html_xml_json } = await import("~/data/bookmarks-example.html-xml.json");
        expect(
            bookmarks_xml_objects,
            "XML objects",
        ).toEqual(bookmarks_example_html_xml_json);

        /* TODO: XML parse result */
    });

    it(`bookmarks-floccus.html`, async () => {
        const bookmarks_xml = await readFile("./data/bookmarks-floccus.html", "utf-8");

        /* XML objects */
        const bookmarks_xml_objects = parser.parser.parse(bookmarks_xml);

        // console.log(JSON.stringify(bookmarks_xml_objects, null, 4));
        // await writeFile("./data/bookmarks-floccus.html-xml.json", JSON.stringify(bookmarks_xml_objects, null, 4));

        const { default: bookmarks_floccus_html_xml_json } = await import("~/data/bookmarks-floccus.html-xml.json");
        expect(
            bookmarks_xml_objects,
            "XML objects",
        ).toEqual(bookmarks_floccus_html_xml_json);

        /* TODO: XML parse result */
    });
});
