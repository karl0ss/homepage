import { useTranslation } from "next-i18next";

import Block from "components/services/widget/block";
import Container from "components/services/widget/container";
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();

  const { widget } = service;

  const { data: blueirisData, error: blueirisAPIError } = useWidgetAPI(widget, "unified", {
    refreshInterval: 5000,
  });

  if (blueirisAPIError) {
    return <Container service={service} error={blueirisAPIError} />;
  }

  if (!blueirisData) {
    return (
      <Container service={service}>
        <Block label="blueiris.serverName" />
        <Block label="blueiris.numberOfActiveCams" />
        <Block label="blueiris.numberOfAlerts" />
      </Container>
    );
  }

  return (
    <Container service={service}>
      <Block label="blueiris.serverName" value= {blueirisData.serverName} />
      <Block label="blueiris.numberOfActiveCams" value={t("common.number", { value: blueirisData.numberOfActiveCams })} />
      <Block label="blueiris.numberOfAlerts" value={t("common.number", { value: blueirisData.totalNumberOfAlerts })} />
    </Container>
  );
}
