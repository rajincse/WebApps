import "./css/MyApp.css";
import { TileGallery } from "./TileGallery/TileGallery";
import { initializeIcons } from '@fluentui/react/lib/Icons';

initializeIcons();

const MyApp = () => {
    return (
        <div>
            <TileGallery />
        </div>
    )
}

export default MyApp;