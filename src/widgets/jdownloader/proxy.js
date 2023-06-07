/* eslint-disable no-underscore-dangle */
import { JDownloaderClient } from 'jdownloader-client';

import getServiceWidget from "utils/config/service-helpers";
import createLogger from "utils/logger";


const proxyName = "jdownloaderProxyHandler";

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

export default async function jdownloaderProxyHandler(req, res) {
    const widget = await getWidget(req);

    if (!widget) {
        return res.status(400).json({ error: "Invalid proxy service type" });
    }
    logger.debug("Getting data from JDRss API");
    const client = new JDownloaderClient(widget.username, widget.password)
    await client.connect()
    const devices = await client.listDevices()
    const packageStatus = await client.downloadsQueryPackages(devices[0].id, {
        "bytesLoaded": false,
        "bytesTotal": true,
        "comment": false,
        "enabled": true,
        "eta": false,
        "priority": false,
        "finished": true,
        "running": true,
        "speed": true,
        "status": true,
        "childCount": false,
        "hosts": false,
        "saveTo": false,
        "maxResults": -1,
        "startAt": 0,
    })
    let totalBytes = 0;
    let totalSpeed = 0;
    packageStatus.forEach(file => {
        totalBytes += file.bytesTotal;
        if (file.speed) {
            totalSpeed += file.speed;
        }
    });

    const data = {
        downloadCount: packageStatus.length,
        totalBytes,
        totalSpeed
    };

    return res.send(data);

}
