
import getServiceWidget from "utils/config/service-helpers";
import { httpProxy } from "utils/proxy/http";
import createLogger from "utils/logger";

const proxyName = "octoprintProxyHandler";
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
//http://192.168.4.200/api/printer?apikey=97F8AA6805FD428E8395C8E5E805D01A
async function printer_stats(params) {
    const path = `/api/printer?apikey=${params.key}`;
    const url = `${new URL(`${params.url}${path}`)}`

    const [status, , data] = await httpProxy(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (status !== 200) {
        logger.error("HTTP %d communicating with jdownloader. Data: %s", status, data.toString());
        return [status, data];
    }

    try {
        const decryptedData = JSON.parse(data)

        return [status, {
            "Status": decryptedData.state.text,
            "Flags": decryptedData.state.flags,
            "Temp":{
                "Tool": decryptedData.temperature.tool0.actual,
                "Bed": decryptedData.temperature.bed.actual
            }
        }];
    } catch (e) {
        logger.error("Error decoding jdownloader API data. Data: %s", data.toString());
        return [status, null];
    }

}

export default async function octoprintProxyHandler(req, res) {
    const widget = await getWidget(req);

    if (!widget) {
        return res.status(400).json({ error: "Invalid proxy service type" });
    }
    logger.debug("Getting data from JDRss API");
    const d = await printer_stats(widget)
    return res.send(d);

}