Offer Wall
===========

The Offer Wall is an Aquto managed service in which user's can select from a list of data rewards offers, complete that offer, and receive a configured data reward. What offers are displayed on the Offer Wall depends on the user's eligibility for this service. Below is simple Javascript API that checks if a user is eligible for this service, and returns the required information to redirect them to the Aquto hosted Offer Wall.

## Setup

```html
<script src="http://assets.aquto.com/moveRewards/aquto.min.js"></script>
```

When embedded as a script tag, it exposes the `aquto` global object.

We assume you are using a DOM manipulation library, such as jQuery. All examples below will assume jQuery $ syntax and should be called in `$(document).ready()` block.

## Check Eligibility

The `checkOfferWallEligibility` method determines if the current user is eligible for the Aquto Offer Wall and returns the number of offers that customer will see when navigating to the Aquto Offer Wall.

### Input arguments
|Key|Type|Required|Description|
|---|:----:|:--------:|-----------|
|callback|function|yes|Function called after checking eligibility on the server|
|carrier|function|false|Unique carrier code that is assigned by Aquto|
|phoneNumber|string|false|Phone number to check for eligibility|

### Response properties
|Key|Type|Optional|Description|
|---|:--:|:------:|-----------|
|eligible|boolean|false|Is the current user eligible for the reward?|
|numberOfOffers|integer|false|Number of offers the user will see when navigating to the Aquto Offer Wall|
|offerWallHref|string|true|The Offer Wall URL is returned when a user is eligible|


```html
<a class="offerWallLink" style="display:none;" />
```

```javascript
aquto.checkOfferWallEligibility({
  callback: function(response) {
    if (response && response.eligible) {
      var $offerWallLink = $('.offerWallLink');
      $offerWallLink.text('Aquto Offer Wall: Number of Offers ' + response.numberOfOffers);
      $offerWallLink.attr('href', response.offerWallHref);
      $offerWallLink.show();
    }
  }
});
```
