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
    const platforms = statistics.filter(x => x.n_roms!=0).length
    const totalRoms = statistics.reduce((total, stat) => total + stat.n_roms, 0);
    return (
        <Container service={service}>
          <Block label="romm.platforms" value={platforms} />
          <Block label="romm.totalRoms" value={totalRoms} />
        </Container>
    );
  }
}