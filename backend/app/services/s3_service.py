import json
import logging
import os
from mimetypes import guess_type

from fastapi import HTTPException
from types_boto3_s3.type_defs import ListObjectsV2OutputTypeDef, GetObjectOutputTypeDef

from app.models.stac_model import StacItemList
from types_boto3_s3 import S3Client
from typing import cast


class S3Service:

    @staticmethod
    async def list_stac_data(s3_client: S3Client) -> StacItemList:
        """
    Retrieves and parses STAC (SpatioTemporal Asset Catalog) like data from an S3 bucket.

    This asynchronous static method lists the STAC data stored in an S3 bucket.
    It filters for `.json` files, retrieves their content, associates them with
    their corresponding image files, and returns a structured list of STAC items.

    The method does the following steps:
    - Lists the objects in the S3 bucket.
    - Filters for JSON files.
    - Reads the content of each JSON file and parses it.
    - Finds the corresponding image file for each JSON item.
    - Adds the image's MIME type to the JSON data.
    - Collects all parsed STAC items into the StacItemList object and returns it.

    Args:
        s3_client (S3Client): The S3 client used to interact with the S3 bucket.

    Returns:
        StacItemList: A list of parsed STAC items, each containing name, metadata and MIME type.

    Raises:
        Exception: If the S3 bucket is empty or an error occurs during object retrieval.
    """
        logger = logging.getLogger("uvicorn.error")
        items = []
        list_objects = cast(
            ListObjectsV2OutputTypeDef,
            await s3_client.list_objects_v2(Bucket=os.environ.get("S3_BUCKET")),
        )
        if list_objects["KeyCount"] == 0:
            logger.error("S3 Bucket %s seems to be empty", os.environ.get("S3_BUCKET"))
        filtered_json_items = [
            item for item in list_objects["Contents"] if item["Key"].endswith(".json")
        ]
        for item in filtered_json_items:
            response = cast(
                GetObjectOutputTypeDef,
                await s3_client.get_object(
                    Bucket=os.environ.get("S3_BUCKET"), Key=item["Key"]
                ),
            )
            content_json = await response["Body"].read()
            content = json.loads(content_json)
            name = item["Key"].removesuffix(".json")
            content["name"] = name
            image_file_name = next(
                item["Key"]
                for item in list_objects["Contents"]
                if item["Key"].startswith(name) and not item["Key"].endswith(".json")
            )
            (mime_type, enconding) = guess_type(image_file_name)
            content["imageMIMEType"] = mime_type
            items.append(content)
        stac_item_list = StacItemList.parse_obj({"items": items})
        return stac_item_list

    @staticmethod
    async def get_image_and_content_type_by_name(s3_client: S3Client, name: str) -> (bytes, str):
        """
    Retrieves the image content and its MIME type from an S3 bucket by its name.

    The method performs the following steps:
    - Lists objects in the S3 bucket with the specified name prefix.
    - Searches for a non-`.json` image file.
    - Retrieves the image content and its content type (MIME type).
    - Returns the image content as bytes and the content type.

    Args:
        s3_client (S3Client): The S3 client used to interact with the S3 bucket.
        name (str): The name of the image to be retrieved from the S3 bucket.

    Returns:
        tuple: A tuple containing:
            - bytes: The content of the image file.
            - str: The MIME type of the image.

    Raises:
        HTTPException: If no image is found for the specified name or if only `.json`
                        files are available for that name in the S3 bucket.
    """
        logger = logging.getLogger("uvicorn.error")
        list_objects = cast(
            ListObjectsV2OutputTypeDef,
            await s3_client.list_objects_v2(
                Bucket=os.environ.get("S3_BUCKET"), Prefix=name
            ),
        )
        count = list_objects["KeyCount"]
        if count == 0:
            raise HTTPException(
                status_code=400, detail="Image with this name does not exist in S3."
            )
        filename = ""
        for item in list_objects["Contents"]:
            if not item["Key"].endswith(".json"):
                filename = item["Key"]
                break
        if filename == "":
            logger.error("Only found JSON files for name: %s", name)
            raise HTTPException(
                status_code=400, detail="Cannot find an image in S3 for the specified name."
            )
        response = cast(
            GetObjectOutputTypeDef,
            await s3_client.get_object(Bucket=os.environ.get("S3_BUCKET"), Key=filename),
        )
        return await response["Body"].read(), response["ContentType"]
