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
        this.tstate = false;
        this.view = false;
    }

    remove(mapview) {
        if (this.marker) {
            this.marker.unbindTooltip();
            mapview.map.removeLayer(this.marker);
            this.marker.remove();
            this.marker = null;
        }
        this.view = false;
    }

    add(mapview) {
        this.view = mapview.map;
        if (!this.hidden) {
            let icon;

            let isCustom = this.image === "gfx/terobjs/mm/custom";
            let isCave = this.name.toLowerCase() === "cave";
            let hsz = 9;

            if (isCustom && !isCave) {
                icon = new ImageIcon({
                    iconUrl: 'gfx/terobjs/mm/custom.png',
                    iconSize: [21, 23],
                    iconAnchor: [11, 21],
                    popupAnchor: [1, 3],
                    tooltipAnchor: [1, 3]
                })
            } else {
                let zoom = HnHMaxZoom - this.view.getZoom();
                let url = `${this.image}.png`;
                if (isCave)
                    url = 'gfx/hud/mmap/cave.png';
                icon = new ImageIcon({iconUrl: url, iconSize: [hsz * 2, hsz * 2], iconAnchor: [hsz, hsz]});
            }

            let position = this.view.unproject([this.position.x, this.position.y], HnHMaxZoom);
            this.marker = L.marker(position, {icon: icon, riseOnHover: true/*, title: this.name*/});
            let col = "#FFF";
            if (this.type === "quest") {
                col = "#FDB800";
            } else if (this.type === "thingwall") {
                col = "#00cffd";
            }
            this.marker.marker = this;
            this.marker.bindTooltip("<div style='color:" + col + ";'><b>" + this.name + "</b></div>", {
                permanent: false,
                direction: 'top',
                sticky: true,
                opacity: 0.9
            });
            this.marker.on('mouseout', function (ev) {
                if (ev.target.marker.tstate) {
                    ev.target.openTooltip();
                }
            });
            // this.marker.bindPopup(this.name);
            // this.marker.on('mouseover', function(ev) {
            //     ev.target.openPopup();
            // });
            // this.marker.on('mouseout', function(ev) {
            //     ev.target.closePopup();
            // });
            this.marker.addTo(mapview.markerLayer);
            this.marker.on("click", this.callClickCallback.bind(this));
            this.marker.on("contextmenu", this.callContextCallback.bind(this));
        }
    }

    tooltipState(value) {
        this.tstate = value;
    }

    bindTooltip() {
        this.tstate = true;
        if (this.marker) {
            this.marker.openTooltip();
        }
    }

    unbindTooltip() {
        this.tstate = false;
        if (this.marker) {
            this.marker.closeTooltip();
        }
    }

    tooltip(value) {
        try {
            console.log(this.name + " " + value);
            if (value)
                this.bindTooltip();
            else
                this.unbindTooltip();
        } catch (e) {
            console.log(e);
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