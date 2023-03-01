
import { registerIcons } from "@fluentui/react/lib/Styling";
import React from "react";
import { ReactComponent as MetricsChartTileImage } from "../svg/MetricsChartTile.svg";

export function registerCustomIcons() {
    console.log("Registering icons");
    registerIcons({
        icons: {
            "MetricsChartTileImage": React.createElement(MetricsChartTileImage)
        },
    });
}