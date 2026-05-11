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
    let raw_title = decodeHTML(cio("h3.panel-title").eq(0).text());

    
    let panel_body = cio("div.panel-body").eq(0);

    let seeders = panel_body.find("div.row").eq(1).find("div.col-md-5").find("span").text();

    console.log(seeders);

    // console.log(title);

    throw new Error("Not implemented");
}