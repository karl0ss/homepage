import Block from "components/services/widget/block";
import Container from "components/services/widget/container";

import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { widget } = service;

  const { data: containersData, error: containersError } = useWidgetAPI(widget, "docker/containers/json", {
    all: 1,
  });

  if (containersError) {
    return <Container service={service} error={containersError} />;
  }

  if (!containersData) {
    return (
      <Container service={service}>
        <Block label="portainer.running" />
        <Block label="portainer.stopped" />
        <Block label="portainer.total" />
      </Container>
    );
  }

  if (containersData.error || containersData.message) {
    // containersData can be itself an error object e.g. if environment fails
    return <Container service={service} error={containersData?.error ?? containersData} />;
  }

  return (
    <Container service={service}>
      <Block label="portainer.running" value={containersData.running} />
      <Block label="portainer.stopped" value={containersData.stopped} />
      <Block label="portainer.total" value={containersData.total} />
    </Container>
  );
}
