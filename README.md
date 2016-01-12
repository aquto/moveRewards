Move Rewards
===========

Allows you to provide MB rewards for user actions.

![Move Rewards User Flow](./MoveRewardsUserFlow.png)

# Setup

This library must be included on both the landing page and thank you page. It can be embedded as a script tag:

```html
<script src="http://assets.kickbit.com/moveRewards/aquto.js"></script>
```

or included using AMD or common.js syntax

```javascript
var aquto = require("aquto.js");
```

When embedded as a script tag, it exposes the `aquto` global object.

We assume you are using a DOM manipulation library, such as jQuery. All examples below will assume jQuery $ syntax and should be called in `$(document).ready()` block.

# Check Eligibility

The `checkEligibility` method determines if the current user if eligible to receive the configured MB reward . This function also starts a reward session on the server that can be completed later. You should call `checkEligibility` on your landing page.

### Input arguments
|Key|Type|Required|Description|
|---|:----:|:--------:|-----------|
|campaignId|string|yes|ID for campaign setup by Aquto|
|callback|function|yes|Function called after checking eligibility on the server|

### Response properties
|Key|Type|Description|
|---|:----:|-----------|
|eligible|boolean|Is the current user eligible for the reward?|
|rewardAmount|integer|Reward amount in MB|
|rewardText|string|Server configured string containing carrier and reward amount. Ex: Purchase any subscription and get 1GB added to your AT&T data plan.|
|carrierLogo|string|Image URL for user's carrier logo|


```html
<div class="rewardBlock">
  <img class="carrierLogo"/>
  <div class="rewardText"></div>
</div>
```

```javascript
aquto.checkEligibility({
  campaignId: '12345',
  callback: function(response) {
    if (response && response.eligible) {
      $('.rewardText').text(response.rewardText);
      $('.carrierLogo').attr({src: response.carrierLogo});
      $('.rewardBlock').show();
    }
  }
});
```


# Complete Reward

The `complete` method finishes the reward session and triggers the MB reward. This method should be called on your thank you page.

### Input arguments
|Key|Type|Required|Description|
|---|:----:|:--------:|-----------|
|campaignId|string|yes|ID for campaign setup by Aquto|
|callback|function|yes|Function called after completing the reward on the server|

### Response properties
|Key|Type|Description|
|---|:----:|-----------|
|success|boolean|Was the reward successfully applied?|
|rewardAmount|integer|Reward amount in MB|
|rewardText|string|Server configured string containing carrier and reward amount. Ex: Congratulations, you just added 1GB to your AT&T data plan!|
|carrierLogo|string|URL for user's carrier logo|

```html
<div class="rewardBlock">
  <img class="carrierLogo"/>
  <div class="rewardText"></div>
</div>
```

```javascript
aquto.complete({
  campaignId: '12345',
  callback: function(response) {
    if (response && response.success) {
      $('.rewardText').text(response.rewardText);
      $('.carrierLogo').attr({src: response.carrierLogo});
      $('.rewardBlock').show();
    }
  }
});
```
