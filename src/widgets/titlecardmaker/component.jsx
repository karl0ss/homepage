import { useTranslation } from "next-i18next";
import Container from "components/services/widget/container";
import Block from "components/services/widget/block";

import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();

  const { widget } = service;

  const { data: statistics, error: statisticsStatsError } = useWidgetAPI(widget, "statistics");

  if (statisticsStatsError) {
    return (
      <Container service={service}>
        <Block label="Error" value={statisticsStatsError.message} />
      </Container>
    );
  }

  if (statisticsStatsError) {
    return <Container service={service} error={statisticsStatsError} />;
  }

  if (statistics) {
    if (widget.fields) {
      return (
        <Container service={service}>
          <Block label="titlecardmaker.totalCards" value={statistics[0].value} />
          <Block label="titlecardmaker.totalSeries" value={statistics[1].value} />
          <Block label="titlecardmaker.monitoredSeries" value={statistics[2].value} />
          <Block label="titlecardmaker.unmonitoredSeries" value={statistics[3].value} />
          <Block label="titlecardmaker.totalEpisodes" value={statistics[4].value} />
          <Block label="titlecardmaker.cardSize" value={t("common.bbytes", { value: statistics[5].value })} />
          <Block label="titlecardmaker.totalFonts" value={statistics[6].value} />
          <Block label="titlecardmaker.totalTemplates" value={statistics[7].value} />
          <Block label="titlecardmaker.totalSyncs" value={statistics[8].value} />
          <Block label="titlecardmaker.loadedCards" value={statistics[9].value} />
        </Container>
      );
    } 
    return (
        <Container service={service}>
          <Block label="titlecardmaker.totalEpisodes" value={statistics[4].value} />
          <Block label="titlecardmaker.totalCards" value={statistics[0].value} />
          <Block label="titlecardmaker.loadedCards" value={statistics[9].value} />
          <Block label="titlecardmaker.cardSize" value={t("common.bbytes", { value: statistics[5].value })} />
        </Container>
    );
  }
}