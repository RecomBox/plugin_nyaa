import request from "@plugin_provider/method/request";
import * as cheerio from 'cheerio';

import type { InputPayload, OutputPayload } from "@plugin_provider/global/types/get_sources";



export default async function start_get_sources(input_payload: InputPayload): Promise<OutputPayload> {
    let prefer_query = "";

    if (input_payload.search){
        prefer_query = input_payload.search;
    }else{
        prefer_query = input_payload.title_secondary
    }

    const url = `https://nyaa.si/?q=${prefer_query}&f=0&c=0_0&p=${input_payload.page}`;

    const res = new request({
        url,
        method: "get"
    });
    await res.send();
    
    let cio = cheerio.load(res.body_text());

    let table = cio("table.torrent-list");
    let tr_list = table.find("tbody").find("tr");

    let data: {
        id: string,
        title: string,
        seeds: number
    }[] = [];
    
    tr_list.each((index, element) => {
        let tr = cio(element);
        let td_list = tr.find("td");
        let a_ele = td_list.eq(1).find("a:not(.comments)");
        
        let raw_title = a_ele.attr("title");
        let seeds = td_list.eq(5).text();

        let id = a_ele.attr("href")?.split("/").at(-1)!;

        let title = `${raw_title} [seeders: ${seeds}]`;

        data.push({
            id,
            title,
            seeds: parseInt(seeds)
        });
    });

    data.sort((a, b) => b.seeds - a.seeds);

    return data;

}