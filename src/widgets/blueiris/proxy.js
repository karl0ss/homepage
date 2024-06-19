/* eslint-disable no-underscore-dangle */
import { httpProxy } from "utils/proxy/http";
import getServiceWidget from "utils/config/service-helpers";
import createLogger from "utils/logger";

const saltedMd5 = require('salted-md5');

const proxyName = "blueirisProxyHandler";

const logger = createLogger(proxyName);

const executeCMD = async (widgetUrl, body) => {
    const url = `${widgetUrl}/json`
    const params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body
    };
    const [status, , data] = await httpProxy(url, params);
    if (status !== 200) {
        logger.debug(`HTTP ${status} performing Request`, data);
        throw new Error(`Failed fetching`);
    }
    let jsonData
    try {
        jsonData = JSON.parse(data.toString());
    } catch (e) {
        logger.debug(`Failed parsing response:`, data);
        throw new Error(`Failed parsing response`);
    }
    return jsonData;
}

const getWidget = async (req) => {
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

const userLogin = async (widget) => {
    let res = await executeCMD(widget.url, "{\"cmd\":\"login\"}");
    const response = await saltedMd5(`${widget.user}:${res.session}:${widget.password}`, '', true);
    res = await executeCMD(widget.url, `{"cmd":"login", "session":"${res.session}", "response":"${response}"}`);
    return {"session": res.session, "serverName":res.data["system name"], "url": widget.url};
}

const activeCamCount = async (widget, session) => {
    const res = await executeCMD(widget.url, `{"cmd":"camlist", "session":"${session}"}`);
    const cameraList = res.data.filter(item => !item.optionDisplay.includes('+') && item.isEnabled);
    return cameraList;
};

const getAllAlerts = async (widget, session) => {
    const res = await activeCamCount(widget, session);
    const promises = res.map(item => executeCMD(widget.url, `{"cmd":"alertlist", "camera":"${item.optionDisplay}", "session":"${session}"}`));
    const results = await Promise.all(promises);
    const alerts = results.reduce((acc, r) => acc + r.data.length, 0);
    return alerts;  
};

const getNewAlerts = async (widget, session) => {
    const res = await activeCamCount(widget, session);
    const promises = res.map(item => executeCMD(widget.url, `{"cmd":"alertlist", "camera":"${item.optionDisplay}", "session":"${session}", "view":"new"}`));
    const results = await Promise.all(promises);
    const alerts = results.reduce((acc, r) => acc + r.data.length, 0);
    return alerts;  
};

export default async function blueirisProxyHandler(req, res) {
    const widget = await getWidget(req);
    const globalUserData = await userLogin(widget);
    const activeCams = await activeCamCount(widget, globalUserData.session);
    const allAlerts = await getAllAlerts(widget, globalUserData.session);
    const newAlerts = await getNewAlerts(widget, globalUserData.session);
    const data = {
        "serverName":globalUserData.serverName,
        "numberOfActiveCams":activeCams.length,
        "totalNumberOfAlerts":allAlerts,
        "totalNumberOfNewAlerts":newAlerts
    };
    return res.status(200).send(data);

}
