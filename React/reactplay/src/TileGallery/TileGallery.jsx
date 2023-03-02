import { DefaultButton, Stack } from "@fluentui/react";
import { Panel } from '@fluentui/react/lib/Panel';
import { useState } from "react";
import { TileGalleryItem } from "./TileGalleryItem";

export const TileGallery = () => {
    const [showTileGallery, setShowTileGallery] = useState(false);
    const TileGalleryRes = {
        header : "Tile Gallery",        
    };
    const DashboardsRes = {
        close: "Close"
    };

    const dismissPanel = () => {
        setShowTileGallery(false);
    }
    
    const containerStackTokens = { childrenGap: 5 };
    return (
        <div>
            <DefaultButton onClick={()=>{
                setShowTileGallery(true);
            } }>Show TileGallery </DefaultButton>
            <Panel
                headerText={TileGalleryRes.header}
                isOpen={showTileGallery}
                onDismiss={dismissPanel}
                closeButtonAriaLabel={DashboardsRes.close}
            >
                <Stack tokens={containerStackTokens}>
                    <TileGalleryItem title="Query" subTitle="Editor" iconName="MetricsChartTileImage" description="Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet." />
                    <TileGalleryItem title="Markdown" subTitle="Editor" iconName="MetricsChartTileImage" description="Monitor your key metrics on a line, area, bar, or scatter chart." />
                </Stack>
            </Panel>
        </div>

    );
}