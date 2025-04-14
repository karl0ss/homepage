import { formatApiCall } from "utils/proxy/api-helpers";
import { httpProxy } from "utils/proxy/http";
import createLogger from "utils/logger";
import widgets from "widgets/widgets";
import getServiceWidget from "utils/config/service-helpers";

const logger = createLogger("wledProxyHandler");

export default async function wledProxyHandler(req, res) {
  const { group, service, endpoint } = req.query;

  if (!group || !service) {
    return res.status(400).json({ error: "Invalid proxy service type" });
  }

  const widget = await getServiceWidget(group, service);
  const api = widgets?.[widget.type]?.api;
  if (!api) {
    return res.status(403).json({ error: "Service does not support API calls" });
  }

  const url = formatApiCall(api, { endpoint, ...widget });
  const method = "GET";

  const [status, contentType, data] = await httpProxy(url, {
    method,
  });

  if (status !== 200) {
    logger.debug("Error %d calling wled endpoint %s", status, url);
    return res.status(status).json({ error: { message: `HTTP Error ${status}`, url, data } });
  }

  if (contentType) res.setHeader("Content-Type", contentType);
  return res.status(status).send(data);
}
