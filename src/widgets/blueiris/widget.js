import blueirisProxyHandler from "./proxy";

const widget = {
  api: "{url}/json",
  proxyHandler: blueirisProxyHandler,

  mappings: {
    unified: {
      endpoint: "/",
    },
  },
};

export default widget;
