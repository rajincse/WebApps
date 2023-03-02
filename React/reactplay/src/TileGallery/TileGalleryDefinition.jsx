export const TileType = {
    ArgQueryTile: "ArgQueryTile",
    ArmQueryTile : "ArmQueryTile",
    ClockTile: "ClockTile",
    DefaultQueryTile: "DefaultQueryTile",
    MarkdownTile : "MarkdownTile",
    ResourceTile : "ResourceTile",
    ResourceGroupsTile : "ResourceGroupsTile",
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
        name: TileType.ArmQueryTile,
        redirectionType: TileRedirectionMode.editor,
        icon: "MetricsChartTile",
        dashboardTemplate: "",
    },{
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
    }, {
        name: TileType.ResourceTile,
        redirectionType: TileRedirectionMode.editor,
        icon: "MetricsChartTile",
        dashboardTemplate: "",
    }, {
        name: TileType.ResourceGroupsTile,
        redirectionType: TileRedirectionMode.editor,
        icon: "MetricsChartTile",
        dashboardTemplate: "",
    },
    ],
}
