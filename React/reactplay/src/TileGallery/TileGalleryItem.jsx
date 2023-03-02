import { FontIcon } from "@fluentui/react";
import { registerCustomIcons } from "../utils/RegisterIcons";
import styles from "../css/TileGallery.module.scss";

registerCustomIcons();

export const TileGalleryItem = (props) => {

    return (
        <div className={styles.tileGalleryItem}>
            <div className={styles.tileGalleryItemPreview}>
                <div className={styles.tileGalleryItemThumbnail}>
                    <FontIcon iconName={props.iconName} className={styles.tileGalleryItemThumbnailImage} />
                </div>
                <div className={styles.tileGalleryItemHeader}>
                    <span className={styles.tileGalleryItemHeaderTitle} title={props.title}>{props.title}</span>
                    <span className={styles.tileGalleryItemHeaderSubtitle} title={props.subTitle}>{props.subTitle}</span>
                </div>
            </div>
            <div className={styles.tileGalleryItemDescription}>
                <span title={props.description}>{props.description}</span>
            </div>
        </div>
    );
}