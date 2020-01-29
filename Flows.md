Create VAST Ad Tag
==================

The VAST flows functionality supports creating an ad tag that displays a video for user to view to receive data rewards. A data rewards video campaign should be created and used. The minimum ad tag size currently supported is 300x250.

Two values are required to generate the code correctly:

|Name|Description|
|:----|:--------|
|cid| Campaign ID (e.g. 123e4567-e89b-12d3-a456-426655440000)|
|vu| VAST tag URL for the video|
|Banner Url| URL for the video poster|
|Width| AD TAG WIDTH (MINIMUM 300)|
|Height| AD TAG HEIGHT (MINIMUM 250)|

VAST tag URL example:

`https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=[timestamp]`

Use the campaign ID and VAST tag URL to generate the following tag, replacing the placeholders ([campaignid] and [vasturl]) with the actual values:

`<iframe id="aq_iframe" src="//assets.aquto.com/moveRewards/flows/vast/tag/v1.html?cid=[campaignid]&amp;vu=[vasturl]" width="300" height="250" style="border: none;"></iframe>`

Make sure to properly encode the parameters before adding them using e.g. https://www.urlencoder.org/

There is also a generator tool available that will generate and preview the tag given the campaign ID and VAST tag URL:

https://assets.aquto.com/moveRewards/flows/vast/tag/generate.html

Enter the campaign ID and VAST tag URL and click "Generate" button to create the ad tag code and preview panel.
