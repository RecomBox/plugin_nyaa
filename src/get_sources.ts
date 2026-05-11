import request from "@plugin_provider/method/request";
import { parse } from 'node-html-parser';

import type { InputPayload, OutputPayload } from "@plugin_provider/global/types/get_sources";

export default async function start_get_sources(input_payload: InputPayload): Promise<OutputPayload> {
    const prefer_query = input_payload.search || input_payload.title_secondary || "";
    const url = `https://nyaa.si/?q=${prefer_query}&f=0&c=0_0&p=${input_payload.page}`;

    const res = new request({
        url,
        method: "get"
    });
    await res.send();
    
    const root = parse(res.body_text());
    const table = root.querySelector("table.torrent-list")!;
    
    const tr_list = table.querySelectorAll("tbody tr");
    const data: { id: string; title: string; seeds: number }[] = [];
    
    for (const i in tr_list) {
        const tr = tr_list[i];
        const td_list = tr?.querySelectorAll("td")!;
        
        const a_ele = td_list[1]!.querySelector("a:not(.comments)")!;
        
        const raw_title = a_ele.getAttribute("title")!.trim();
        const seeds_str = td_list[5]!.text;
        const href = a_ele.getAttribute("href")!;
        const id = href.split("/").pop()!;

        data.push({
            id,
            title: `${raw_title} [seeders: ${seeds_str}]`,
            seeds: parseInt(seeds_str, 10) || 0
        });
    }

    data.sort((a, b) => b.seeds - a.seeds);
    return data;
}