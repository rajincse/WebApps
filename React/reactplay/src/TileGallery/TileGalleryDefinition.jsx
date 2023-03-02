export const TileType = {
    ArgQueryTile: "ArgQueryTile",
    ClockTile: "ClockTile",
    DefaultQueryTile: "DefaultQueryTile",
    MarkdownTile : "MarkdownTile",
}

export const TileRedirectionMode = {
    editor : "editor",
}

export const TileGalleryDefinition = {
    TileTypes: [{
        name: TileType.ArgQueryTile,
        redirectionType: TileRedirectionMode.editor,
        icon: "ResourceGraph",
        dashboardTemplate: "",
    }, {
        name: TileType.ClockTile,
        redirectionType: TileRedirectionMode.editor,
        icon: "ClockTile",
        dashboardTemplate: "",
    }, {
        name: TileType.DefaultQueryTile,
        redirectionType: TileRedirectionMode.editor,
        icon: "MetricsChartTile",
        dashboardTemplate: "",
    }, {
        name: TileType.MarkdownTile,
        redirectionType: TileRedirectionMode.editor,
        icon: "MarkdownTile",
        dashboardTemplate: "",
    },
    ],
}
