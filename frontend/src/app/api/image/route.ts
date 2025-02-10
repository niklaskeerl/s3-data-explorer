import { NextRequest, NextResponse } from "next/server";


/**
 * Handles a GET request to fetch an image from a backend service.
 * 
 * This function extracts the image name from the query parameters in the request URL,
 * then constructs the backend URL to fetch the image. It fetches the image, checks for errors,
 * and returns the image with appropriate headers. If any error occurs during the process,
 * a relevant error message is returned with an appropriate status code.
 * 
 * @param {NextRequest} req - The incoming request object containing the query parameters.
 * @returns {NextResponse} The response, either an image or an error message.
 * 
 * @throws {Error} If fetching the image from the backend fails, an error is thrown with details.
 */
export async function GET(req: NextRequest) {
    const name = req.nextUrl.searchParams.get('name') as string;

    if (!name) {
        return NextResponse.json({ error: "Image name is required" }, {status: 400});
    }

    try {
        const backendUrl = `${process.env.BACKEND_BASE_URL}image?name=${name}`;
        const response = await fetch(backendUrl);
        
        if (!response.ok) {
            throw new Error(`Error fetching image: ${response.status} ${response.statusText}`);
        }

        const imageBuffer = await response.arrayBuffer();
        const contentType = response.headers.get("Content-Type") || "image/jpeg";

        const headers = new Headers();

        headers.set("Content-Type", contentType);

        return new NextResponse(Buffer.from(imageBuffer), { status: 200, statusText: "OK", headers });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch image" }, {status: 500});
    }
}