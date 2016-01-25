Move Rewards
===========

Allows you to provide MB rewards for user actions.

![Move Rewards User Flow](./MoveRewardsUserFlow.png)

# Setup

This library must be included on both the landing page and thank you page. It can be embedded as a script tag:

```html
<script src="http://assets.kickbit.com/moveRewards/aquto.js"></script>
```

<!-- or included using AMD or common.js syntax

```javascript
var aquto = require("aquto.js");
``` -->

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
|Key|Type|Optional|Description|
|---|:--:|:------:|-----------|
|eligible|boolean|false|Is the current user eligible for the reward?|
|rewardAmount|integer|true|Reward amount in MB|
|rewardText|string|true|Server configured string containing carrier and reward amount. Ex: Purchase any subscription and get 1GB added to your AT&T data plan.|
|carrier|string|true|Code for user's carrier|


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
      $('.rewardHeader').addClass('rewardHeader'+response.carrier);
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
|Key|Type|Optional|Description|
|---|:--:|:------:|-----------|
|eligible|boolean|false|Is the user still eligible for the reward|
|rewardAmount|integer|true|Reward amount in MB|
|rewardText|string|true|Server configured string containing carrier and reward amount. Ex: Congratulations, you just added 1GB to your AT&T data plan!|
|carrier|string|true|Code for user's carrier|

```html
<div class="rewardBlock">
  <div class="rewardHeader"></div>
  <div class="rewardText"></div>
</div>
```

```javascript
aquto.complete({
  campaignId: '12345',
  callback: function(response) {
    if (response && response.eligible) {
      $('.rewardText').text(response.rewardText);
      $('.rewardHeader').addClass('rewardHeader'+response.carrier);
      $('.rewardBlock').show();
    }
  }
});
```
