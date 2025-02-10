import { NextRequest, NextResponse } from "next/server";


/**
 * Handles a GET request to fetch STAC like data from a backend service.
 * 
 * This function checks if the request method is GET, and if so, it fetches data from the
 * backend service specified in the environment variable `BACKEND_BASE_URL`. If the request 
 * method is not GET, it returns a 405 Method Not Allowed response. It returns the JSON data 
 * from the backend or an error message if the fetch fails.
 * 
 * @param {NextRequest} req - The incoming request object containing information about the HTTP request.
 * @returns {NextResponse} The response containing the fetched data or an error message.
 * 
 * @throws {Error} If an error occurs while fetching the data from the backend, an error is thrown with details.
 */
export async function GET(req: NextRequest) {
    if(req.method !== 'GET'){
        return NextResponse.json({statusText: "Method not allowed"}, {status: 405})
    }

    try {
        const response = await fetch(process.env.BACKEND_BASE_URL as string);
        
        if (!response.ok) {
            throw new Error(`Error fetching stac data: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();

        return NextResponse.json(json);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch image" }, {status: 500})
    }
}