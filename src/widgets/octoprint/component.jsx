// import { Buffer } from 'buffer';

// import Container from "components/services/widget/container";
// import Block from "components/services/widget/block";
// import useWidgetAPI from "utils/proxy/use-widget-api";

// export default function Component({ service }) {
//   const { widget } = service;

//   const { data: printerStats, error: printerStatsError } = useWidgetAPI(widget, "printer_stats");
//   // const { data: jobStats, error: jobStatsError } = useWidgetAPI(widget, "job_stats");

//   if (printerStatsError && jobStats) {
//     return (
//       <Container service={service}>
//         <Block label="octoprint.printer_state" value={jobStats.state} />
//       </Container>
//     );
//   }

//   if (printerStatsError) {
//     let msg
//     try {
//       msg = JSON.parse(Buffer.from(printerStatsError.resultData.data).toString()).error;
//     } catch (error) {
//       msg = 'Octoprint Not Found'
//     }
//     return (
//       <Container service={service}>
//         <Block label="Error" value={msg} />
//       </Container>
//     );
//   }

//   // if (jobStatsError) {
//   //   return <Container service={service} error={jobStatsError} />;
//   // }

//   const state = printerStats[1].Status;
//   const tempTool = printerStats[1].Temp.Tool;
//   const tempBed = printerStats[1].Temp.Bed;

//   if (!printerStats || !state || !tempTool || !tempBed) {
//     return (
//       <Container service={service}>
//         <Block label="octoprint.printer_state" />
//       </Container>
//     );
//   }

//   const printingStateFalgs = ["Printing", "Paused", "Pausing", "Resuming"];

//   if (printingStateFalgs.includes(state)) {
//     const completion = jobStats?.progress?.completion;

//     if (!jobStats || !completion) {
//       return (
//         <Container service={service}>
//           <Block label="octoprint.printer_state" />
//           <Block label="octoprint.temp_tool" />
//           <Block label="octoprint.temp_bed" />
//           <Block label="octoprint.job_completion" />
//         </Container>
//       );
//     }

//     return (
//       <Container service={service}>
//         <Block label="octoprint.printer_state" value={printerStats.state.text} />
//         <Block label="octoprint.temp_tool" value={`${printerStats.temperature.tool0.actual} °C`} />
//         <Block label="octoprint.temp_bed" value={`${printerStats.temperature.bed.actual} °C`} />
//         <Block label="octoprint.job_completion" value={`${completion.toFixed(2)}%`} />
//       </Container>
//     );
//   }

//   return (
//     <Container service={service}>
//       <Block label="octoprint.printer_state" value={printerStats.state.text} />
//       <Block label="octoprint.temp_tool" value={`${printerStats.temperature.tool0.actual} °C`} />
//       <Block label="octoprint.temp_bed" value={`${printerStats.temperature.bed.actual} °C`} />
//     </Container>
//   );
// }
