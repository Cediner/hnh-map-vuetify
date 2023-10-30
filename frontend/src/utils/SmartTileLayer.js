import L, {Bounds, LatLng, Point, Util, Browser} from "leaflet"

export const SmartTileLayer = L.TileLayer.extend({
    cache: {},
    invalidTile: "",
    map: 0,

    getTileUrl: function (coords) {
        return this.getTrueTileUrl(coords, this._getZoomForUrl());
    },

    getTrueTileUrl: function (coords, zoom) {
        const data = {
            r: Browser.retina ? '@2x' : '',
            s: this._getSubdomain(coords),
            x: coords.x,
            y: coords.y,
            map: this.map,
            z: zoom
        };
        if (this._map && !this._map.options.crs.infinite) {
            const invertedY = this._globalTileRange.max.y - coords.y;
            if (this.options.tms) {
                data['y'] = invertedY;
            }
            data['-y'] = invertedY;
        }

        data['cache'] = this.cache[data['map'] + ':' + data['x'] + ':' + data['y'] + ':' + data['z']];

        if (!data['cache'] || data['cache'] === -1) {
            return this.invalidTile;
        }

        return Util.template(this._url, Util.extend(data, this.options));
    },

    refresh: function (x, y, z) {
        let zoom = z;
        let maxZoom = this.options.maxZoom;
        let zoomReverse = this.options.zoomReverse;
        let zoomOffset = this.options.zoomOffset;

        if (zoomReverse) {
            zoom = maxZoom - zoom;
        }

        zoom = zoom + zoomOffset;

        let key = x + ':' + y + ':' + zoom;

        let tile = this._tiles[key];
        if (tile) {
            tile.el.src = this.getTrueTileUrl({x: x, y: y}, z);
        }
    }
});