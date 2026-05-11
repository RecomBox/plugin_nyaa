import type * as get_sources_types from "@plugin_provider/global/types/get_sources";
import type * as get_torrents_types from "@plugin_provider/global/types/get_torrents";

import start_get_sources from "./get_sources";
import start_get_torrents from "./get_torrents";

export async function get_sources(input_payload: get_sources_types.InputPayload): Promise<get_sources_types.OutputPayload> {

    return await start_get_sources(input_payload);
}

export async function get_torrents(input_payload: get_torrents_types.InputPayload): Promise<get_torrents_types.OutputPayload> {
    return await start_get_torrents(input_payload);
}