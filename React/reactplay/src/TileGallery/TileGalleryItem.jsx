import { FontIcon } from "@fluentui/react";
import { registerCustomIcons } from "../utils/RegisterIcons";
registerCustomIcons();

export const TileGalleryItem = (props) => {

    return (
        <div className="tileGalleryItem">
            <div className="tileGalleryItem-preview">
                <div className="tileGalleryItem-thumbnail">
                    <FontIcon iconName="MetricsChartTileImage" className="tileGalleryItem-thumbnail-image" />
                </div>
                <div className="tileGalleryItem-header">
                    <span  className="tileGalleryItem-header-title" title={props.title}>{props.title}</span>
                    <span className="tileGalleryItem-header-subtitle" title={props.type}>{props.type}</span>
                </div>
            </div>
            <div className="tileGalleryItem-description">
                <span title={props.description}>{props.description}</span>
            </div>
        </div>
    );
}