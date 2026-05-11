import request from "@plugin_provider/method/request";
import { parse } from 'node-html-parser';
import { decodeHTML } from 'entities';

import type { InputPayload, OutputPayload } from "@plugin_provider/global/types/get_torrents";

export default async function start_get_torrents(input_payload: InputPayload): Promise<OutputPayload> {

    let url = `https://nyaa.si/view/${input_payload.id}`;

    let res = new request({
        url,
        method: "get"
    });
    await res.send();

    let root = parse(res.body_text());
    
    let raw_title = decodeHTML(root.querySelectorAll("h3.panel-title")[0]!.text.trim());

    let panel_body = root.querySelectorAll("div.panel-body")[0]!;

    let seeders = panel_body.querySelectorAll("div.row")[1]!.querySelector("div.col-md-5 span")!.text.trim();

    let title = `${raw_title} [seeders: ${seeders}]`;
    let torrent_url = `https://nyaa.si/download/${input_payload.id}.torrent`
    
    return [{
        title,
        torrent_url: torrent_url,
    }]
}