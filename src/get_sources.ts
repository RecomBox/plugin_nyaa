import request from "@plugin_provider/method/request";
import { parseHTML } from 'linkedom';

import type { InputPayload, OutputPayload } from "@plugin_provider/global/types/get_sources";

// Define an internal interface to ensure type safety within the function
interface TorrentData {
    id: string;
    title: string;
    seeds: number;
}

export default async function start_get_sources(input_payload: InputPayload): Promise<OutputPayload> {
    let prefer_query: string = "";

    if (input_payload.search) {
        prefer_query = input_payload.search;
    } else {
        prefer_query = input_payload.title_secondary || "";
    }

    const url = `https://nyaa.si/?q=${encodeURIComponent(prefer_query)}&f=0&c=0_0&p=${input_payload.page}`;

    const res = new request({
        url,
        method: "get"
    });
    await res.send();
    
    const { document } = parseHTML(res.body_text());

    const table = document.querySelector("table.torrent-list");
    // Explicitly cast to an array-like or use Array.from if boa supports it.
    // However, a simple null check is safest for the engine.
    const tr_list = table?.querySelectorAll("tbody tr");

    let data: TorrentData[] = [];
    
    if (tr_list) {
        // Using a standard for loop is the "safest" for boa_engine compatibility
        for (let i = 0; i < tr_list.length; i++) {
            const tr = tr_list[i];
            const td_list = tr.querySelectorAll("td");
            
            if (td_list.length < 6) continue;

            const a_ele = td_list[1].querySelector("a:not(.comments)");
            
            const raw_title: string = a_ele?.getAttribute("title")?.trim() || "Unknown Title";
            const seeds_text: string = td_list[5].textContent || "0";

            const href: string = a_ele?.getAttribute("href") || "";
            const id: string = href.split("/").pop() || "";

            const title: string = `${raw_title} [seeders: ${seeds_text}]`;

            data.push({
                id: id,
                title: title,
                seeds: parseInt(seeds_text, 10) || 0
            });
        }
    }

    data.sort((a, b) => b.seeds - a.seeds);

    return data;
}