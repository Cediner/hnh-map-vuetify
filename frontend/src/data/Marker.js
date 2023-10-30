import {HnHMaxZoom, ImageIcon} from "../utils/LeafletCustomTypes";
import * as L from "leaflet";

function detectType(name) {
    if (name === "gfx/invobjs/small/bush" || name === "gfx/invobjs/small/bumling" || name === "gfx/terobjs/mm/gianttoad") return "quest";
    if (name === "gfx/terobjs/mm/thingwall") return "thingwall";
    if (name === "custom") return "custom";
    let idx = name.lastIndexOf("/");
    return idx === -1 ? name : name.substring(name.lastIndexOf("/") + 1);
}

export class Marker {
    constructor(markerData) {
        this.id = markerData.id;
        this.position = markerData.position;
        this.name = markerData.name;
        this.image = markerData.image;
        this.type = detectType(this.image);
        this.marker = false;
        this.text = this.name;
        this.value = this.id;
        this.hidden = markerData.hidden;
        this.map = markerData.map;
        this.onClick = null;
        this.onContext = null;
    }

    remove(mapview) {
        if (this.marker) {
            this.marker.remove();
            this.marker = null;
        }
    }

    add(mapview) {
        if (!this.hidden) {
            let icon;

            let isCustom = this.image === "gfx/terobjs/mm/custom";
            let isCave = this.name.toLowerCase() === "cave";

            if (isCustom && !isCave) {
                icon = new ImageIcon({
                    iconUrl: 'gfx/terobjs/mm/custom.png',
                    iconSize: [21, 23],
                    iconAnchor: [11, 21],
                    popupAnchor: [1, 3],
                    tooltipAnchor: [1, 3]
                })
            } else {
                let zoom = HnHMaxZoom - mapview.map.getZoom();
                let hsz = 9;
                let url = `${this.image}.png`;
                if (isCave)
                    url = 'gfx/hud/mmap/cave.png';
                icon = new ImageIcon({iconUrl: url, iconSize: [hsz * 2, hsz * 2], iconAnchor: [hsz, hsz]});
            }

            let position = mapview.map.unproject([this.position.x, this.position.y], HnHMaxZoom);
            this.marker = L.marker(position, {icon: icon, title: this.name});
            if (this.type === "quest")
                this.marker.bindTooltip("<div style='color:#FDB800;'><b>" + this.name + "</b></div>", { permanent: true, direction: 'top', opacity: 0.9 });
            else if (this.type === "thingwall")
                this.marker.bindTooltip("<div style='color:#00cffd;'><b>" + this.name + "</b></div>", { permanent: true, direction: 'top', opacity: 0.9 });
            // this.marker.bindPopup(this.image);
            // this.marker.on('mouseover',function(ev) {
            //     ev.target.openPopup();
            // });
            this.marker.addTo(mapview.markerLayer);
            this.marker.on("click", this.callClickCallback.bind(this));
            this.marker.on("contextmenu", this.callContextCallback.bind(this));
        }
    }

    /**
     * Перемещение к какому-либо маркеру
     * @param map
     */
    jumpTo(map) {
        if (this.marker) {
            let position = map.unproject([this.position.x, this.position.y], HnHMaxZoom);
            this.marker.setLatLng(position);
        }
    }

    setClickCallback(callback) {
        this.onClick = callback;
    }

    callClickCallback(e) {
        if (this.onClick != null) {
            this.onClick(e);
        }
    }

    setContextMenu(callback) {
        this.onContext = callback;
    }

    callContextCallback(e) {
        if (this.onContext != null) {
            this.onContext(e);
        }
    }
}