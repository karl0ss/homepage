/* eslint-disable no-underscore-dangle */
import { formatApiCall } from "utils/proxy/api-helpers";
import { httpProxy } from "utils/proxy/http";
import getServiceWidget from "utils/config/service-helpers";
import createLogger from "utils/logger";
import widgets from "widgets/widgets";


const proxyName = "JDRssProxyHandler";

const logger = createLogger(proxyName);

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

async function fetchDataFromJDRss(endpoint, widget) {
    const api = widgets?.[widget.type]?.api;
    if (!api) {
        return [403, null];
    }
    const url = `${new URL(formatApiCall(api, { endpoint, ...widget }))}`
    const [status, contentType, data] = await httpProxy(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (status !== 200) {
        logger.error("HTTP %d communicating with JDRss. Data: %s", status, data.toString());
        return [status, data];
    }

    try {
        return [status, JSON.parse(data), contentType];
    } catch (e) {
        logger.error("Error decoding JDRss API data. Data: %s", data.toString());
        return [status, null];
    }
}

export default async function JDRssProxyHandler(req, res) {
    const widget = await getWidget(req);

    if (!widget) {
        return res.status(400).json({ error: "Invalid proxy service type" });
    }

    logger.debug("Getting data from JDRss API");
    // Get data from JDRss stats API
    const [status, apiData] = await fetchDataFromJDRss('stats', widget);

    if (status !== 200) {
        return res.status(status).json({ error: { message: "HTTP error communicating with JDRss API", data: Buffer.from(apiData).toString() } });
    }
    const data = {
        showCount:apiData.ShowList ,
        retryCache:apiData.RetryCache,
        feedCache: apiData.FeedCache

    };

    return res.status(status).send(data);

}
