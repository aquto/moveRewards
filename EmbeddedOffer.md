Embedded Offer Wall Offer
=========================
The embedded offer wall allows an offer to be embedded into any website. Following the instructions below to integrate.

## Setup
To embed an offer on a website, include the javascript library and an HTML tag in the page where the offers should be 
loaded.

Place the following script tag in the head of your page (between \<head\> and \</head\>). If you have a custom integration 
domain use that instead of ow.aquto.com:

```html
<script src="http://ow.aquto.com/scripts/embed.min.js"></script>
```

Then add the following div tag on the page where the offers should be rendered:
```html
<div id="aquto-offerwall-embed"
  data-opcode="<opcode>"
  data-offerwall-domain="<offerwallDomain>"
  data-style-background-color="<styleBackgroundColor>"
  data-style-title-color="<styleTitleColor>"
  data-style-title-font="<styleTitleFont>"
  data-style-text-color="<styleTextColor>"
  data-style-text-font="<styleTextFont>"
></div>
```

If you need more control over when the offers get loaded you can use our javascript API directly instead of using the
"aquto-offerwall-embed" div tag:

```javascript
aquto.offerWall.render({
  id: "<id>",
  opcode: "<opcode>",
  offerwallDomain: "<offerwallDomain>",
  styleBackgroundColor: "<styleBackgroundColor>",
  styleTitleColor: "<styleTitleColor>",
  styleTitleFont: "<styleTitleFont>",
  styleTextColor: "<styleTextColor>",
  styleTextFont: "<styleTextFont>"
});
```

### Available Attributes:
| Field                | Type   | Required | Description |
|----------------------|--------|----------|-------------|
| id                   | String | Yes | For div tag integration this should always be "aquto-offerwall-embed". For API integration this is the ID of the div tag to embed the offer in |
| opcode               | String | Yes | This is the operator code for the offerwall and will be provided by Aquto |
| offerwallDomain      | String | No  | The domain of the offerwall you are integrated with. This defaults to ow.aquto.com |
| styleBackgroundColor | String | No  | Background color e.g. "#ff0000" or "red" |
| styleTitleColor      | String | No  | Heading color e.g. "#ff0000" or "red" |
| styleTitleFont       | String | No  | Font family to use for headings. This should equal the CSS font-family value e.g. "Verdana" |
| styleTextColor       | String | No  | Text color e.g. "#ff0000" or "red" |
| styleTextFont        | String | No  | Font family to use for text. This should equal the CSS font-family value e.g. "Verdana" |

### Notes
- If no offer is available or the user cannot be identified, nothing will be rendered
- For div tag integration the offer loading will be initiated on DOMContentLoaded
