import { ImageIcon } from "@fluentui/react";
import MetricsChartTile from "../svg/MetricsChartTile.svg"

export const TileGalleryItem = (props) => {

    return (
        <div className="tileGalleryItem">
            <div className="ext-tilegallery-thumbnail msportalfx-svg-palette-blue">
                <ImageIcon imageProps={ {src: MetricsChartTile} } />
            </div>
            <div className="ext-tilegallery-wrapper">
                <span title={props.title}>{props.title}</span>
                <span title={props.description}>{props.description}</span>
            </div>
        </div>
    );
}