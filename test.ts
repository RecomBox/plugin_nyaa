import { describe, it, expect } from "vitest";

import { get_sources, get_torrents } from "./src/plugin";

// describe("get_sources", () => {
//     it("should fetch sources", async () => {
//         let result = await get_sources({
//             id: "test",
//             title: "love is war",
//             title_secondary: "love is war",
//             episode: 1,
//             season: 1,
//             page: 1,
//             source: "anime",
//             search: "",
//         });

//         console.log(result);

//         expect(result).toBeDefined();
//     });
// });

describe("get_torrents", () => {
    it("should fetch sources", async () => {
        let result = await get_torrents({
            id: "2059738",
            page: 1,
            source: "anime",
        })

        console.log(result);

        expect(result).toBeDefined();
    });
});
