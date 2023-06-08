import jdownloaderProxyHandler from "./proxy";

const widget = {
  api: "{url}/api/{endpoint}",
  proxyHandler: jdownloaderProxyHandler,

  mappings: {
    unified: {
      endpoint: "/",
    },
  },
};

export default widget;
