import { useTranslation } from "next-i18next";
import Block from "components/services/widget/block";
import Container from "components/services/widget/container";

import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
    const { t } = useTranslation();

    const { widget } = service;

    const { data: wgeasyData, error: wgeasyAPIError } = useWidgetAPI(widget, "unified", {
        refreshInterval: 60000,
    });

    if (wgeasyAPIError) {
        return <Container service={service} error={wgeasyAPIError} />;
    }

    if (!wgeasyData) {
        return (
            <Container service={service}>
                <Block label="jdrssdownloader.totalShows" />
                <Block label="jdrssdownloader.retryCache" />
                <Block label="jdrssdownloader.feedCache" />
            </Container>
        );
    }

    return (
        <Container service={service}>
            <Block label="jdrssdownloader.totalShows" value={t("common.number", { value: wgeasyData.showCount })} />
            <Block label="jdrssdownloader.retryCache" value={t("common.number", { value: wgeasyData.retryCache })} />
            <Block label="jdrssdownloader.feedCache" value={t("common.number", { value: wgeasyData.feedCache })} />
        </Container>
    );
}