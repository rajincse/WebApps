import * as React from 'react';
import { DefaultButton, Stack, PrimaryButton } from "@fluentui/react";
import { Panel } from '@fluentui/react/lib/Panel';
import { useState } from "react";
import { TileGalleryItem } from "./TileGalleryItem";
import styles from "../css/TileGallery.module.scss";

export const TileGallery = () => {
    const [showTileGallery, setShowTileGallery] = useState(false);
    const TileGalleryRes = {
        header: "Tile Gallery",
    };
    const DashboardsRes = {
        close: "Close"
    };

    const dismissPanel = React.useCallback(() => {
        setShowTileGallery(false);
    }, []);

    const containerStackTokens = { childrenGap: 5 };

    const onRenderFooterContent = React.useCallback(
        () => (
            <div>
                <PrimaryButton onClick={dismissPanel} styles={{ root: { marginRight: 8 } }}>
                    Add
                </PrimaryButton>
            </div>
        ),
        [dismissPanel]
    );

    return (
        <div>
            <DefaultButton onClick={() => {
                setShowTileGallery(true);
            }}>Show TileGallery </DefaultButton>
            <Panel
                headerText={TileGalleryRes.header}
                isOpen={showTileGallery}
                onDismiss={dismissPanel}
                closeButtonAriaLabel={DashboardsRes.close}
                onRenderFooterContent={onRenderFooterContent}
                isFooterAtBottom={false}
            >
                <div className={styles.tileGalleryDescription}>
                    <span>Drag and drop or select tile and click "Add". You can add other parts of the portal to the dashboard by pinning. </span>
                    <a href="https://go.microsoft.com/fwLink/?LinkID=2155614&amp;amp;clcid=0x9" target="_blank">Learn more</a>
                </div>
                <Stack tokens={containerStackTokens}>
                    <TileGalleryItem title="Query" subTitle="Editor" iconName="MetricsChartTileImage" description="Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet." />
                    <TileGalleryItem title="Markdown" subTitle="Editor" iconName="MetricsChartTileImage" description="Monitor your key metrics on a line, area, bar, or scatter chart." />
                </Stack>
            </Panel>
        </div>

    );
}