/* eslint-disable no-underscore-dangle */
import { formatApiCall } from "utils/proxy/api-helpers";
import { httpProxy } from "utils/proxy/http";
import getServiceWidget from "utils/config/service-helpers";
import createLogger from "utils/logger";
import widgets from "widgets/widgets";


const proxyName = "wgeasyProxyHandler";

const logger = createLogger(proxyName);
let globalSid = null;

async function getWidget(req) {
    const { group, service } = req.query;
    if (!group || !service) {
        logger.debug("Invalid or missing service '%s' or group '%s'", service, group);
        return null;
    }
    const widget = await getServiceWidget(group, service);
    if (!widget) {
        logger.debug("Invalid or missing widget for service '%s' in group '%s'", service, group);
        return null;
    }

    return widget;
}


async function loginToWGEasy(endpoint, widget) {
    const api = widgets?.[widget.type]?.api;
    if (!api) {
        return [403, null];
    }
    // Create new session on WgEasy
    let url = new URL(formatApiCall(api, { endpoint, ...widget }));

    let [status, contentType, data, responseHeaders] = await httpProxy(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            password: widget.password,
        })
    });

    if (status !== 204) {
        logger.error("HTTP %d communicating with NextPVR. Data: %s", status, data.toString());
        return [status, data, responseHeaders];
    }
    try {
        globalSid = responseHeaders["set-cookie"][0]
    } catch (e) {
        logger.error("Error decoding NextPVR API data. Data: %s", data.toString());
        return [status, null];
    }
    logger.info('gettingSID')
    return [status, true];
}


async function fetchDataFromWGeasy(endpoint, widget, sid) {
    const api = widgets?.[widget.type]?.api;
    if (!api) {
        return [403, null];
    }
    const url = `${new URL(formatApiCall(api, { endpoint, ...widget }))}`
    const [status, contentType, data] = await httpProxy(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': sid
        },
    });

    if (status !== 200) {
        logger.error("HTTP %d communicating with WGeasy. Data: %s", status, data.toString());
        return [status, data];
    }

    try {
        return [status, JSON.parse(data), contentType];
    } catch (e) {
        logger.error("Error decoding WGeasy API data. Data: %s", data.toString());
        return [status, null];
    }
}

export default async function WGeasyProxyHandler(req, res) {
    const widget = await getWidget(req);

    if (!globalSid) {
        await loginToWGEasy('session', widget);
    }
    if (!widget) {
        return res.status(400).json({ error: "Invalid proxy service type" });
    }

    logger.debug("Getting data from WGeasy API");
    // Calculate the number of clients
    let [status, apiData] = await fetchDataFromWGeasy('wireguard/client', widget, globalSid);

    if (status !== 200) {
        return res.status(status).json({ error: { message: "HTTP error communicating with WGeasy API", data: Buffer.from(apiData).toString() } });
    }
    let clientCount;
    clientCount = apiData.length;
    
    const data = {
        clientCount
    };

    return res.status(status).send(data);

}


