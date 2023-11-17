import {HnHMaxZoom} from "../utils/LeafletCustomTypes";
import * as L from "leaflet";

export class Character {
    constructor(characterData) {
        this.name = characterData.name;
        this.position = characterData.position;
        this.type = characterData.type;
        this.id = characterData.id;
        this.map = characterData.map;
        this.marker = false;
        this.text = this.name;
        this.value = this.id;
        this.onClick = null;
        this.tstate = false;
    }

    getId() {
        return `${this.name}`;
    }

    remove(mapview) {
        if (this.marker) {
            this.marker.unbindTooltip();
            mapview.map.removeLayer(this.marker);
            this.marker.remove();
            this.marker = null;
        }
    }

    add(mapview) {
        if (this.map === mapview.mapid) {
            let position = mapview.map.unproject([this.position.x, this.position.y], HnHMaxZoom);
            this.marker = L.marker(position, {riseOnHover: true/*title: this.name*/});
            this.marker.marker = this;
            this.marker.bindPopup(this.name);
            this.marker.bindTooltip("<div style='color:#48fd00;'><b>" + this.name + "</b></div>", {
                permanent: true,
                direction: 'top',
                sticky: true,
                opacity: 1,
                offset: [-13, 0]
            });
            // this.marker.on('mouseover', function(ev) {
            //     ev.target.openPopup();
            // });
            // this.marker.on('mouseout', function(ev) {
            //     ev.target.closePopup();
            // });
            this.marker.on("click", this.callCallback.bind(this));
            this.marker.addTo(mapview.map);
            this.unbindTooltip();
        }
    }

    update(mapview, updated) {
        if (this.map !== updated.map) {
            this.remove(mapview);
        }
        this.map = updated.map;
        this.position = updated.position;
        if (!this.marker && this.map === mapview.mapid) {
            this.add(mapview);
        }
        if (this.marker) {
            let position = mapview.map.unproject([updated.position.x, updated.position.y], HnHMaxZoom);
            this.marker.setLatLng(position);
        }
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
        if (value)
            this.bindTooltip();
        else
            this.unbindTooltip();
    }

    setClickCallback(callback) {
        this.onClick = callback;
    }

    callCallback(e) {
        if (this.onClick != null) {
            this.onClick(e);
        }
    }
}