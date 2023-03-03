export const DashboardConstants = {
    DefaultNewDashboardId: "new",
    ArmApiVersion: {
        December2022Preview: "2022-12-01-preview",
        April2014Preview: "2014-04-01-preview",
    },
    DashboardResourceType: "Microsoft.Portal/dashboards",
    DashboardSkipGroupSize: 20,
    QueryResultGrid: {
        Column: {
            minWidth: 128,
        },
    },
    Links: {
        TileGalleryOverview: "https://go.microsoft.com/fwLink/?LinkID=2155614",
    }
};

export const noop = () => { }; // eslint-disable-line @typescript-eslint/no-empty-function
