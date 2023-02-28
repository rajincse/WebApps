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
                    <TileGalleryItem title="Query" type="Editor" description="Add a query tile" />
                    <TileGalleryItem title="Markdown" type="Editor" description="Add a Markdown tile" />
                </Stack>
            </Panel>
        </div>

    );
}