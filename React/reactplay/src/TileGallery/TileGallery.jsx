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

    const tileGalleryItems = TileGalleryDefinition.TileTypes.map((item,i) => {
        const resourceItem = TileGalleryRes[item.name];

        const title = resourceItem.title;
        const description = resourceItem.description;

        const subTitle = TileGalleryRes.RedirectionType[item.redirectionType];

        return (
            <TileGalleryItem title={title} subTitle={subTitle} description={description} iconName={item.icon} key={i}/>
        );
    });

    const containerStackTokens = { childrenGap: 5 };

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
            >
                <div className={styles.tileGalleryContainer}>
                    <div className={styles.tileGalleryDescription}>
                        <span>{TileGalleryRes.description}</span>
                        <a href="https://go.microsoft.com/fwLink/?LinkID=2155614&amp;amp;clcid=0x9" target="_blank" rel="noreferrer">{TileGalleryRes.learnMore}</a>
                    </div>
                    <div className={styles.tileGallerySearchBox}>

                    </div>
                    <div className={styles.tileGalleryTileList}>
                        <Stack tokens={containerStackTokens}>
                            {tileGalleryItems}
                        </Stack>
                    </div>
                    <div className={styles.tileGalleryActions}>
                        <PrimaryButton onClick={dismissPanel} styles={{ root: { marginRight: 8 } }}>
                            Add
                        </PrimaryButton>
                    </div>
                </div>
            </Panel>
        </div>

    );
}