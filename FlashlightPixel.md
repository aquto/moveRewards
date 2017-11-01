Flashlight Pixel
===========

The MoVE Flashlight Pixel is a 1x1 Aquto hosted pixel that allows Aquto to identify eligible traffic on either a publisher or a sponsors mobile property. The pixel identifies which operator the traffic is coming from and the specific operator subscriber and is part of the Network Based Identification (NBI) technology offered in the Aquto Marketing Stack. NBI is performed with no interaction with the subscriber, and is completely transparent to the subscriber.


The factors that impact NBI include:
* How much of the traffic is cellular
* How much of the traffic is sourced from Operators Aquto has integrated NBI technology with
* How much cross-pollination of cellular and Wi-Fi traffic the sponsor experiences

# The Pixel
Below is request definition of the 1x1 pixel. It is invoked slightly differently if being invoked by a publisher or a sponsore. 

## Publisher/Sponsor Site-wide Pixel
The publisher/sponsor site-wide pixel is used for a publisher or sponsor site that is not explicitly driving specific campaign traffic. The pixel is placed on one or more publisher/sponsor pages soley to pre-identify traffic and not to drive a particular data reward campaign. Examples of a publisher/sponsor site-wide pixel include a publisher that is helping Aquto pre-identify subscribers or a sponsor that has a mobile web-property looking to pre-identify subscribers for the purposes of retargeting them at a future time.

### Input arguments
|Attribute|Type|Required|Description|
|---|:----:|:--------:|-----------|
|publisherSiteUuid|string|yes|Site UUID provided by Aquto|
|channel|string|no|Optional field to identify the particular inventory|

### Publisher/Sponsor Site-wide Pixel
```html
<img src="://app.aquto.com/api/campaign/datarewards/pixel?publisherSiteUuid=57a0b099-766c-42c3-9315-9f71a8ed7eb7&channel=homepage" height="1" width="1" border="0">
```


## Sponsor Campaign Pixel
The sponsor Campaign pixel is flighted with a specific campaign. The main purpose the the Sponsor Campaign Pixel is to count the number of impressions a campaign has received. It can take an optional publisherSiteUuid if the campaign is explicitly flight on a given site. It can also take an optional channel if dynamic definition of the inventory is required. 

### Input arguments
|Attribute|Type|Required|Description|
|---|:----:|:--------:|-----------|
|campaignId|string|yes|The Campaign ID provided by Aquto|
|publisherSiteUuid|string|yes|Site UUID provided by Aquto|
|channel|string|no|Optional field to identify the particular inventory|

### Direct Placement on a Specific Site
```html
<img src="://app.aquto.com/api/campaign/datarewards/pixel?campaignId=423442&publisherSiteUuid=57a0b099-766c-42c3-9315-9f71a8ed7eb7" height="1" width="1" border="0">
```

### Dynamic Definition of inventory
A default site is still required even if all site information is dynamic.

In this example, the channel parameter is being used to identify traffic across multiple dynamic sites. 
```html
<img src="://app.aquto.com/api/campaign/datarewards/pixel?campaignId=423442&publisherSiteUuid=57a0b099-766c-42c3-9315-9f71a8ed7eb7&channel=MySite1" height="1" width="1" border="0">
```

In this example, the channel parameter is being used to identify traffic on a single site, but multiple pages or placements. 
```html
<img src="://app.aquto.com/api/campaign/datarewards/pixel?campaignId=423442&publisherSiteUuid=57a0b099-766c-42c3-9315-9f71a8ed7eb7&channel=HomepageTop" height="1" width="1" border="0">
```

## Optional Sponsors User Identifier to Subscriber Linking
In addition, the Aquto Flashlight Pixel support the ability to link a sponsor's user identifier (such as a login identifier) with the resolved subscriber information determined by Aquto's NBI technnology. This allows the sponsor to use their own user identifiers when invoking the Aquto Data Rewards API.

To use this technology, the Sponsor simply needs to add the Aquto assigned advertiserId and their userIdentifier to the pixel request. 

### Input arguments
|Attribute|Type|Required|Description|
|---|:----:|:--------:|-----------|
|advertiserId|string|yes|The Sponsor's ID provided by Aquto that represents the sponsor|
|userIdentifier|string|yes|The Sponsor defined user identifier|

### Publisher/Sponsor Site-wide Pixel
```html
<img src="://app.aquto.com/api/campaign/datarewards/pixel?publisherSiteUuid=57a0b099-766c-42c3-9315-9f71a8ed7eb7&advertiserId=103214&userIdentifier=32052053" height="1" width="1" border="0">
```

### Direct Placement on a Specific Site w/ Subscriber Linking
```html
<img src="://app.aquto.com/api/campaign/datarewards/pixel?campaignId=423442&publisherSiteUuid=57a0b099-766c-42c3-9315-9f71a8ed7eb7&advertiserId=103214&userIdentifier=32052053" height="1" width="1" border="0">
```



