import { useTranslation } from "next-i18next";

import Block from "components/services/widget/block";
import Container from "components/services/widget/container";
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();

  const { widget } = service;

  const { data: wgeasyData, error: wgeasyAPIError } = useWidgetAPI(widget, "unified", {
    refreshInterval: 5000,
  });

  if (wgeasyAPIError) {
    return <Container service={service} error={wgeasyAPIError} />;
  }

  if (!wgeasyData) {
    return (
      <Container service={service}>
        <Block label="wgeasy.clients" />
      </Container>
    );
  }

  return (
    <Container service={service}>
      <Block label="wgeasy.clients" value={t("common.number", { value: wgeasyData.clientCount })} />
    </Container>
  );
}
