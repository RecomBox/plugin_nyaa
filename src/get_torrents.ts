import request from "@plugin_provider/method/request";
import * as cheerio from 'cheerio';
import { decodeHTML } from 'entities';

import type { InputPayload, OutputPayload } from "@plugin_provider/global/types/get_torrents";



export default async function start_get_torrents(input_payload: InputPayload): Promise<OutputPayload> {


    let url = `https://nyaa.si/view/${input_payload.id}`;

    let res = new request({
        url,
        method: "get"
    });
    await res.send();

    

    let cio = cheerio.load(res.body_text());
    let raw_title = decodeHTML(cio("h3.panel-title").eq(0).text().trim());

    
    let panel_body = cio("div.panel-body").eq(0);

    let seeders = panel_body.find("div.row").eq(1).find("div.col-md-5").find("span").text();

    let title = `${raw_title} [seeders: ${seeders}]`;
    let torrent_url = `https://nyaa.si/download/${input_payload.id}.torrent`
    
    return [{
        title,
        torrent_url: torrent_url,
    }]
}