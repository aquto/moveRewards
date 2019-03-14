Embedded Offer Wall Offer
=========================
The embedded offer wall allows an offer to be embedded into any website. Follow the instructions below to integrate.

## Setup
To embed an offer on a website, include the javascript library and an HTML tag in the page where the offers should be 
loaded.

Place the following style and script tags in the head of your page (between \<head\> and \</head\>). If you have a custom integration 
domain use that instead of ow.aquto.com:

```html
<link rel="stylesheet" href="http://ow.aquto.com/embed/embed.min.css" />
<script src="http://ow.aquto.com/embed/embed.min.js"></script>
```

Then add the following div tag on the page where the offers should be rendered:
```html
<div id="aquto-offerwall-embed"
  data-offerwall-domain="<offerwallDomain>"
  data-style-background-color="<styleBackgroundColor>"
  data-style-title-color="<styleTitleColor>"
  data-style-title-font="<styleTitleFont>"
  data-style-text-color="<styleTextColor>"
  data-style-text-font="<styleTextFont>"
  data-style-theme="<styleTheme>"
  data-publisher-site-uuid="<publisherSiteUuid>"
  data-channel="<channel>"
  data-phone-number="<phoneNumber>"
  data-operator-code="<operatorCode>"
  data-hide-offerwall-link="<hideOfferwallLink>"
  data-hide-terms="<hideTerms>"
  data-fixed-card-height="<fixedCardHeight>"
  data-offer-types="<offerTypes>"
  data-max-offers="<maxOffers>"
  data-allow-vpaid-offers="<allowVpaidOffers>"
  data-zero-rate-vpaid-offers="<zeroRateVpaidOffers>"
  data-format="<format>"
  data-on-no-offers="<onNoOffersCallback>"
  data-on-offers-available="<onOffersAvailableCallback>"
></div>
```

If you need more control over when the offers get loaded you can use our javascript API directly instead of using the
"aquto-offerwall-embed" div tag:

```javascript
aquto.offerWall.render({
  id: "<id>",
  offerwallDomain: "<offerwallDomain>",
  styleBackgroundColor: "<styleBackgroundColor>",
  styleTitleColor: "<styleTitleColor>",
  styleTitleFont: "<styleTitleFont>",
  styleTextColor: "<styleTextColor>",
  styleTextFont: "<styleTextFont>",
  styleTheme: "<styleTheme>",
  publisherSiteUuid: "<publisherSiteUuid>",
  channel: "<channel>",
  phoneNumber: "<phoneNumber",
  operatorCode: "<operatorCode>",
  hideOfferwallLink: <hideOfferwallLink>,
  hideTerms: <hideTerms>,
  fixedCardHeight: <fixedCardHeight>,
  offerTypes: "<offerTypes>",
  maxOffers: "<maxOffers>",
  allowVpaidOffers: <allowVpaidOffers>,
  zeroRateVpaidOffers: <zeroRateVpaidOffers>,
  format: <format>,
  onNoOffers: <onNoOffersCallback>,
  onOffersAvailable: <onOffersAvailableCallback>
});
```

### Available Attributes:
| Field                | Type    | Required | Description |
|----------------------|---------|----------|-------------|
| id                   | String  | Yes | For div tag integration this should always be "aquto-offerwall-embed". For API integration this is the ID of the div tag to embed the offer in |
| offerwallDomain      | String  | No  | The domain of the offerwall you are integrated with. This defaults to ow.aquto.com |
| styleBackgroundColor | String  | No  | Background color e.g. "#ff0000" or "red" |
| styleTitleColor      | String  | No  | Heading color e.g. "#ff0000" or "red" |
| styleTitleFont       | String  | No  | Font family to use for headings. This should equal the CSS font-family value e.g. "Verdana" |
| styleTextColor       | String  | No  | Text color e.g. "#ff0000" or "red" |
| styleTextFont        | String  | No  | Font family to use for text. This should equal the CSS font-family value e.g. "Verdana" |
| styleTheme           | String  | No  | Color theme to use. Available themes are "dark", "light" and "default" |
| publisherSiteUuid    | String  | No  | Unique tracking code assigned by Aquto |
| channel              | String  | No  | Incent channel string is used for reporting purposes |
| phoneNumber          | String  | No  | Phone number of subscriber |
| operatorCode         | String  | No  | Operator code of subscriber |
| hideOfferwallLink    | Boolean | No  | Whether to hide link to offerwall. This defaults to false |
| hideTerms            | Boolean | No  | Whether to hide link to terms and conditions. This defaults to false |
| fixedCardHeight      | Boolean | No  | Whether to keep a fixed card size so all offers will have the same div height. This defaults to false. When using carousel it is recommended to set this value to true so that all the offer cards have the same height |
| offerTypes           | String  | No  | Comma delimited list of offer types to include. Valid types are video, leadgen & apps (external offer). If left empty all types will be included |
| maxOffers            | Integer | No  | Maximum number of offers to display. If this number is greater than 1 a carousel will be displayed with the available offers. Default: 10, Max: 10 |
| allowVpaidOffers     | Boolean | No  | Set to true to include VPAID offers. This defaults to false |
| zeroRateVpaidOffers  | Boolean | No  | Set to true to proxy all external resources when playing a VPAID offer. This defaults to false. It is recommened to load the widget in a iframe if this is set as it will capture all external requests so could interfere with other parts of the page. |
| format     | String | No  | Set format size of Embedded Offer Wall. Available formats: ad300x250, default. If omitted default format will be used |
| onNoOffers     | Function | No  | Set callback function to be executed when there are NO offers available |
| onOffersAvailable     | Function | No  | Set callback function to be executed when there are offers available |

### Notes
- If no offer is available or the user cannot be identified, nothing will be rendered
- For div tag integration the offer loading will be initiated on DOMContentLoaded
- The rendered offers will fill the containing element but will stay within the range of 310px - 430px wide. The height will span from 444px - 512px including carousel navigation.
