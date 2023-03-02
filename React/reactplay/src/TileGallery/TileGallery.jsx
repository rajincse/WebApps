import * as React from 'react';
import { DefaultButton, Stack, PrimaryButton } from "@fluentui/react";
import { Panel } from '@fluentui/react/lib/Panel';
import { useState } from "react";
import { TileGalleryItem } from "./TileGalleryItem";
import styles from "../css/TileGallery.module.scss";
import { TileGalleryRes, DashboardsRes } from "./TileGalleryResources";
import { TileGalleryDefinition } from "./TileGalleryDefinition";

export const TileGallery = () => {
    const [showTileGallery, setShowTileGallery] = useState(false);

    const dismissPanel = React.useCallback(() => {
        setShowTileGallery(false);
    }, []);

    const tileGalleryItems = TileGalleryDefinition.TileTypes.map(item => {
        const resourceItem = TileGalleryRes[item.name];

        const title = resourceItem.title;
        const description = resourceItem.description;

        const subTitle = TileGalleryRes.RedirectionType[item.redirectionType];

        return (
            <TileGalleryItem title={title} subTitle={subTitle} description={description} iconName={item.icon} />
        );
    });

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
                <div>
                    <div className={styles.tileGalleryDescription}>
                        <span>Drag and drop or select tile and click "Add". You can add other parts of the portal to the dashboard by pinning. </span>
                        <a href="https://go.microsoft.com/fwLink/?LinkID=2155614&amp;amp;clcid=0x9" target="_blank" rel="noreferrer">Learn more</a>
                    </div>
                    <div>

                    </div>
                    <div>
                        <Stack tokens={containerStackTokens}>
                            {tileGalleryItems}
                        </Stack>
                    </div>
                    <div>

                    </div>
                </div>
            </Panel>
        </div>

    );
}