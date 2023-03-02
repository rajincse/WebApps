import * as React from 'react';
import { DefaultButton, Stack, PrimaryButton, initializeIcons, Text, Link, SearchBox } from "@fluentui/react";
import { Panel } from '@fluentui/react/lib/Panel';
import { useState } from "react";
import { TileGalleryItem } from "./TileGalleryItem";
import styles from "../css/TileGallery.module.scss";
import { TileGalleryRes, DashboardsRes } from "./TileGalleryResources";
import { TileGalleryDefinition } from "./TileGalleryDefinition";
import { registerCustomIcons } from '../utils/RegisterIcons';
import { IconButton } from "@fluentui/react/lib/Button";

registerCustomIcons();
initializeIcons();

export const TileGallery = () => {
    const [showTileGallery, setShowTileGallery] = useState(false);

    const dismissPanel = React.useCallback(() => {
        setShowTileGallery(false);
    }, []);

    const tileGalleryItems = TileGalleryDefinition.TileTypes.map((item, i) => {
        const resourceItem = TileGalleryRes[item.name];

        const title = resourceItem.title;
        const description = resourceItem.description;

        const subTitle = TileGalleryRes.RedirectionType[item.redirectionType];

        return (
            <TileGalleryItem title={title} subTitle={subTitle} description={description} iconName={item.icon} key={i} />
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
                        <Text style={{ marginTop: "auto" }}>
                            {TileGalleryRes.description}
                            <Link href="https://docs.microsoft.com/azure/lighthouse/how-to/onboard-customer" target="_blank">
                                {TileGalleryRes.learnMore}
                            </Link>
                            <IconButton iconProps={{ iconName: "NavigateExternalInline" }} className="reactview-inlineicon" ariaLabel={DashboardsRes.learnMore} />
                        </Text>
                    </div>
                    <div className={styles.tileGallerySearchBoxContainer}>
                        <SearchBox placeholder={TileGalleryRes.Search.placeHolder} onSearch={newValue => console.log('value is ' + newValue)} className={styles.tileGallerySearchBox} />
                    </div>
                    <div className={styles.tileGalleryTileList}>
                        <Stack tokens={containerStackTokens}>
                            {tileGalleryItems}
                        </Stack>
                    </div>
                    <div className={styles.tileGalleryActions}>
                        <PrimaryButton onClick={dismissPanel} styles={{ root: { marginRight: 8 } }}>
                            {DashboardsRes.add}
                        </PrimaryButton>
                    </div>
                </div>
            </Panel>
        </div>

    );
}