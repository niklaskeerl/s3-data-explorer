from pydantic import BaseModel, Field
from typing import List


class StacProperties(BaseModel):
    datetime: str
    cloud_cover: float = Field(alias="eo:cloud_cover", default=1.00)
    sun_elevation: float = Field(alias="view:sun_elevation", default=1.00)
    epsg: int = Field(alias="proj:epsg", default=1)


class StacItem(BaseModel):
    name: str
    imageMIMEType: str
    properties: StacProperties


class StacItemList(BaseModel):
    items: List[StacItem]



