'use client';
import { SatelliteItemList } from "@/components/data-loader/types";
import DataCard from "@/components/data-card/DataCard";
import { useEffect, useState } from "react";


/**
 * A component that loads satellite data from the backend API and displays it in a grid format.
 * 
 * It fetches data from the `/api/stac` endpoint and handles potential errors in fetching the data.
 * Once the data is successfully loaded, it renders a grid of `DataCard` components with each item.
 * If an error occurs while fetching, an error message is displayed.
 * 
 * @returns The JSX element representing the data grid or an error message.
 * 
 * @example
 * <DataLoader />
 */
export default function DataLoader(){
    const [data, setData] = useState<SatelliteItemList>();
    const [error, setError] = useState();
    useEffect(() => {
        fetch('/api/stac')
          .then((response) => response.json())
          .then((data: SatelliteItemList) => {
            setData(data);
          }).catch((error) => setError(error));
      }, []);
        if(data){
            return(
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.items.map((item) => (
                        <DataCard 
                            key={item.name}
                            name={item.name}
                            imageSource={`/api/image?name=${item.name}`}
                            imageProperties={item.properties}
                        />
                    ))}
                </div>
            )
        }
        else {
            if(error){
                console.error('Error fetching data:', error);
                const typedError = error as Error;
                return(
                    <div>
                        <p>{typedError.name} {typedError.message} Failed to fetch data. The backend seems to be not reachable. Try again later</p>
                    </div>
                )
            }
        }
}