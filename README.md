MoVE Rewards
===========

MoVE allows you to reward engagement with your brand through every step of the customer journey, increasing the number of new customers, while increasing engagement with existing customers.


# MoVE for Commerce

Reward customers with mobile data in a wide range of scenarios, such as making purchases, booking reservations, enrolling in notifications, and help increase add-on items during the purchase process while reducing cart abandonment.

In general, the integration will happen in two places, the landing page, where the initial offer is displayed and the thank you page, where the reward confirmation is displayed.

![Move Rewards User Flow](./MoveRewardsUserFlow.png)

## Setup

This library must be included on both the landing page and thank you page. It can be embedded as a script tag:

```html
<script src="http://assets.aquto.com/moveRewards/aquto.min.js"></script>
```

When embedded as a script tag, it exposes the `aquto` global object.

We assume you are using a DOM manipulation library, such as jQuery. All examples below will assume jQuery $ syntax and should be called in `$(document).ready()` block.

## Check Eligibility

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


## Complete Reward

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


# MoVE for Organic App Downloads

With MoVE for Organic App Installs you can reward users in real time with data for downloading your app. This removes the burden of cellular data usage for downloading your apps.

## Setup

This library must be included on the app download page. It can be embedded as a script tag:

```html
<script src="http://assets.aquto.com/moveRewards/aquto.min.js"></script>
```

When embedded as a script tag, it exposes the `aquto` global object.

We assume you are using a DOM manipulation library, such as jQuery. All examples below will assume jQuery $ syntax and should be called in `$(document).ready()` block.

## Pre-Qualification

The check eligibility call make take a few seconds due to communication with the carrier. To improve the performance of the eligibility call, you can include the following 1x1 pixel earlier in the user flow. We will cache the user's eligibility information and further calls to check eligibility should be faster.

```html
<img src="http://app.kickbit.com/api/campaign/datarewards/pixel" height="1" width="1" border="0">
```

## Check Eligibility

The `checkAppEligibility` method determines if the current user if eligible to receive the configured MB reward . This function also starts a reward session on the server that can be completed later.

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
|clickUrl|string|true|Url to replace app download link|


```html
<div class="rewardBlock">
  <img class="carrierLogo"/>
  <div class="rewardText"></div>
</div>

<a class="continue" href="#">Get App</a>
```

```javascript
aquto.checkAppEligibility({
  campaignId: '12345',
  callback: function(response) {
    if (response && response.eligible) {
      $('.rewardText').text(response.rewardText);
      $('.rewardHeader').addClass('rewardHeader'+response.carrier);
      $('.rewardBlock').show();
    }
    if (response && response.clickUrl) {
      $('.continue').attr('href', response.clickUrl);
    }
  }
});
```

## Complete

In order to complete the conversion, you need to set up a server side callback through one of our integration partners.

* Adjust
* Tune
* Appsflyer
* Kochava

Select Aquto as publisher and provider iOS and Android click trackers to your Aquto account manager.
