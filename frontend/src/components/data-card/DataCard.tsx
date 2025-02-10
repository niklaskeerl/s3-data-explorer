'use client'
import { DataCardProps } from "./types";


/**
 * A component that displays a card with information about a satellite image.
 * 
 * This component takes in props containing the satellite image's metadata and visualizes
 * the image along with several properties, such as the image name, date, cloud cover,
 * sun elevation, and EPSG (coordinate reference system).
 * 
 * @component
 * @param {DataCardProps} dataCardProps - The properties for the data card.
 * 
 * @returns A JSX element representing the card that displays the satellite image and its properties.
 * 
 * @example
 * const props = {
 *   name: "Satellite Image 1",
 *   imageSource: "/api/image?name=image1",
 *   imageProperties: {
 *     datetime: "2023-02-10T12:00:00Z",
 *     "eo:cloud_cover": 5,
 *     "view:sun_elevation": 45,
 *     "proj:epsg": 4326
 *   }
 * };
 * <DataCard {...props} />
 */
export default function DataCard(dataCardProps: DataCardProps){
    return(
      <div className="rounded-lg overflow-hidden border border-yellow-400 bg-card hover:bg-card-hover transition-colors mx-auto w-[80%]">
      <div className="relative aspect-[4/3] m-3 sm:m-4">
        <img
          src={dataCardProps.imageSource}
          alt={dataCardProps.name}
          className="object-cover rounded-lg"
        />
      </div>
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-2">{dataCardProps.name}</h3>
        <div className="space-y-2">
          <p className="text-sm sm:text-base text-gray-300">
            <span className="font-semibold text-yellow-400">Date:</span> {new Date(dataCardProps.imageProperties.datetime).toLocaleString()}
          </p>
          <p className="text-sm sm:text-base text-gray-300">
            <span className="font-semibold text-yellow-400">Cloud Cover:</span> {dataCardProps.imageProperties["eo:cloud_cover"]}
          </p>
          <p className="text-sm sm:text-base text-gray-300">
            <span className="font-semibold text-yellow-400">Sun Elevation:</span> {dataCardProps.imageProperties["view:sun_elevation"]}
          </p>
          <p className="text-sm sm:text-base text-gray-300">
            <span className="font-semibold text-yellow-400">EPSG:</span> {dataCardProps.imageProperties["proj:epsg"]}
          </p>
        </div>
      </div>
    </div>
    )
}