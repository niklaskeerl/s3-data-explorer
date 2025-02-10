from contextlib import asynccontextmanager

import aioboto3
from dotenv import load_dotenv
from typing import cast
from botocore.exceptions import NoCredentialsError, ClientError, EndpointConnectionError
from fastapi import FastAPI, HTTPException, Response, Request
from fastapi.responses import JSONResponse
from types_boto3_s3 import S3Client
import logging

from app.models.stac_model import StacItemList
from app.services.s3_service import S3Service

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    An asynchronous context manager for setting up and tearing down the lifespan of a FastAPI application.

    This function establishes an S3 client using the `aioboto3` session and stores it in the `app.state.s3_client` attribute.
    The client is available during the lifespan of the FastAPI application and is automatically cleaned up when the application shuts down.

    Args:
        app (FastAPI): The FastAPI application instance.

    Yields:
        None: The context is yielded to allow the FastAPI application to run. The S3 client is set on the app's state
              and can be used within the app during its lifespan.

    Usage:
        This context manager can be used with FastAPI's `lifespan` parameter to manage resources during the app's runtime.
    """
    session = aioboto3.Session()
    async with session.client("s3") as s3_client:
        app.state.s3_client = s3_client
        yield


app = FastAPI(lifespan=lifespan, title="Satellite Data API", description="Backend for S3 Data Explorer",
              version="1.0.0")

logger = logging.getLogger("uvicorn.error")


@app.exception_handler(EndpointConnectionError)
def endpoint_exception_handler(request: Request, exception: EndpointConnectionError):
    logger.error("S3 is not reachable. Is it running?")
    logger.error("S3 EndpointConnectionError: %s", str(exception))
    return JSONResponse(
        status_code=504, content={"detail": "S3 Endpoint cannot be reached."}
    )


@app.exception_handler(NoCredentialsError)
def credentials_exception_handler(request: Request, exception: NoCredentialsError):
    logger.error("S3 credentials are missing.")
    logger.error("S3 NoCredentailsError: %s", str(exception))
    return JSONResponse(
        status_code=500, content={"detail": "S3 credentials are missing on the server."}
    )


@app.exception_handler(ClientError)
def client_error_exception_handler(request: Request, exception: ClientError):
    error = exception.response.get("Error")
    logger.error("S3 ClientError: %s", str(error))
    return JSONResponse(
        status_code=400,
        content={"detail": "S3 Client Error with message: " + error.get("Message")},
    )


@app.get("/", tags=["STAC"])
async def list_stac_data() -> StacItemList:
    """
    Lists the STAC (SpatioTemporal Asset Catalog) data available in S3 storage.

    This asynchronous function retrieves and returns a list of STAC like items
    stored in an S3 bucket by utilizing the S3 service.

    Returns:
        StacItemList: A list of STAC items available in the S3 bucket.
    """
    s3_client = cast(S3Client, app.state.s3_client)
    return await S3Service().list_stac_data(s3_client)


@app.get("/image",
         tags=["Download"],
         responses={
             400: {
                 "description": "Image with this name does not exist in S3."
             },
             200: {
                 "description": "Successful image response",
                 "content": {
                     "image/png": {
                         "schema": {"type": "string", "format": "binary"},
                         "example": "Binary PNG image data"
                     },
                     "image/jpeg": {
                         "schema": {"type": "string", "format": "binary"},
                         "example": "Binary JPEG image data"
                     },
                 },
             }
         }, )
async def get_image_by_name(name: str = "") -> Response:
    """
    Retrieves an image from an S3 bucket by its name.

    This asynchronous function fetches an image and its content type from an S3 storage
    service based on the provided image name. If the name is not provided, it raises
    an HTTPException with a 400 status code. The image content and its content type
    are then returned as a Response.

    Args:
        name (str): The name of the image to be retrieved from the S3 bucket.
                    Default is an empty string.

    Returns:
        Response: A response object containing the image content and its media type.

    Raises:
        HTTPException: If the image name is an empty string, a 400 HTTPException
                        is raised with a relevant error message.
    """
    if name == "":
        raise HTTPException(status_code=400, detail="Name of image cannot be empty")
    s3_client = cast(S3Client, app.state.s3_client)
    content, content_type = await S3Service().get_image_and_content_type_by_name(s3_client=s3_client, name=name)
    return Response(content=content, media_type=content_type)
