import { DefaultButton, Stack } from "@fluentui/react";
import { Panel } from '@fluentui/react/lib/Panel';
import { useState } from "react";

const TileGalleryItem = (props) => {

    return (
        <div className="tileGalleryItem">
            <div className="ext-tilegallery-thumbnail msportalfx-svg-palette-blue">
                <img alt="" src="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31" />
            </div>
            <div className="ext-tilegallery-wrapper">
                <span title={props.title}>{props.title}</span>
                <span title={props.description}>{props.description}</span>
            </div>
        </div>
    );
}

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
                    <TileGalleryItem title="Query" description="Add a query tile" />
                    <TileGalleryItem title="Markdown" description="Add a Markdown tile" />
                </Stack>
            </Panel>
        </div>

    );
}