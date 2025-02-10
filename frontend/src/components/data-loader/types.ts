export interface SatelliteItemList {
    items: SatelliteItem[]
}

export interface SatelliteItem {
    name: string,
    imageMIMEType: string,
    properties: SatelliteItemProperties
}

export interface SatelliteItemProperties {
    datetime: string,
    "eo:cloud_cover": number,
    "view:sun_elevation": number,
    "proj:epsg": number
}