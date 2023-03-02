
import { registerIcons } from "@fluentui/react/lib/Styling";
import React from "react";
import { ReactComponent as MetricsChartTileImage } from "../svg/MetricsChartTile.svg";

export function registerCustomIcons() {
    registerIcons({
        icons: {
            "ResourceGraph": <MetricsChartTileImage />,
            "ClockTile": <MetricsChartTileImage />,
            "MetricsChartTile": <MetricsChartTileImage />,
            "MarkdownTile": <MetricsChartTileImage />,
        },
    });
}