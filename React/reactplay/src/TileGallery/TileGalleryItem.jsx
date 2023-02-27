export const TileGalleryItem = (props) => {

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