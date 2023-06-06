import JDRssProxyHandler from "./proxy";

const widget = {
    api: "{url}/api/{endpoint}",
    proxyHandler: JDRssProxyHandler,

    mappings: {
        unified: {
            endpoint: "/",
        },
    },
};

export default widget;