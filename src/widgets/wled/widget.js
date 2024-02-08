import wledProxyHandler from "./proxy";

const widget = {
  api: "{url}/{endpoint}",
  proxyHandler: wledProxyHandler,

  mappings: {
    api: {
      endpoint: "json/",
    },
  },
};

export default widget;
