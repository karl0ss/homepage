import nextpvrProxyHandler from "./proxy";

const widget = {
  api: "{url}api/{endpoint}",
  proxyHandler: nextpvrProxyHandler,

  mappings: {
    unified: {
      endpoint: "/",
    },
  },
};

export default widget;
