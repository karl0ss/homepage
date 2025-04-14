import Container from "components/services/widget/container";
import Block from "components/services/widget/block";

import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { widget } = service;

  const { data: wledData, error: wledError } = useWidgetAPI(widget, "api");

  if (wledError) {
    return <Container service={service} error={wledError} />;
  }

  if (!wledData) {
    return (
      <Container service={service}>
        <Block label="wled.deviceName" />
        <Block label="wled.deviceState " />
      </Container>
    );
  }
  let state
  if (wledData.state.on === true){
    state = "On";
  } else {
    state = "Off";
  }

  return (

    <Container service={service}>
      <Block label="wled.deviceName" value= {wledData.info.name} />
      <Block label="wled.deviceState" value={state} />
    </Container>
  );
}
