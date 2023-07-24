import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";
import { Buffer } from 'buffer';

export default function Component({ service }) {
  const { widget } = service;

  const { data: printerStats, error: printerStatsError } = useWidgetAPI(widget, "printer_stats");
  const { data: jobStats, error: jobStatsError } = useWidgetAPI(widget, "job_stats");

  if (printerStatsError) {
    const msg = JSON.parse(new Buffer.from(printerStatsError.resultData.data).toString());
    return (
      <Container service={service}>
        <Block label="OFFLINE" value={msg.error} />
      </Container>
    );
  }

  if (jobStatsError) {
    return <Container service={service} error={jobStatsError} />;
  }

  const state = printerStats?.state?.text;
  const tempTool = printerStats?.temperature?.tool0?.actual;
  const tempBed = printerStats?.temperature?.bed?.actual;

  if (!printerStats || !state || !tempTool || !tempBed) {
    return (
      <Container service={service}>
        <Block label="octoprint.printer_state" />
      </Container>
    );
  }

  const printingStateFalgs = ["Printing", "Paused", "Pausing", "Resuming"];

  if (printingStateFalgs.includes(state)) {
    const { completion } = jobStats.progress;

    if (!jobStats || !completion) {
      return (
        <Container service={service}>
          <Block label="octoprint.printer_state" />
          <Block label="octoprint.temp_tool" />
          <Block label="octoprint.temp_bed" />
          <Block label="octoprint.job_completion" />
        </Container>
      );
    }

    return (
      <Container service={service}>
        <Block label="octoprint.printer_state" value={printerStats.state.text} />
        <Block label="octoprint.temp_tool" value={`${printerStats.temperature.tool0.actual} °C`} />
        <Block label="octoprint.temp_bed" value={`${printerStats.temperature.bed.actual} °C`} />
        <Block label="octoprint.job_completion" value={`${completion.toFixed(2)}%`} />
      </Container>
    );
  }

  return (
    <Container service={service}>
      <Block label="octoprint.printer_state" value={printerStats.state.text} />
      <Block label="octoprint.temp_tool" value={`${printerStats.temperature.tool0.actual} °C`} />
      <Block label="octoprint.temp_bed" value={`${printerStats.temperature.bed.actual} °C`} />
    </Container>
  );
}
