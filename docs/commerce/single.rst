Single-Page flow
----------------

The single-page MoVE Reward Commerce flow is ideal for flows where the offer is displayed to the customer and they are rewarded for taking an action directly on that page, such as watching a video to completion. This flow does not utilize 3rd party cookies like the Multi-page MoVE Reward Commerce Flow, and instead returns a token when the offer is displayed to the customer. The same token is provided to the Javascript SDK when the user completes the offer and is shown the reward confirmation.

Setup
^^^^^

This library must be included on the page. It can be embedded as a script tag:

.. code-block:: html

  <script src="http://assets.aquto.com/moveRewards/aquto.min.js"></script>


When embedded as a script tag, it exposes the ``aquto`` global object.

Check Eligibility
^^^^^^^^^^^^^^^^^

The ``checkEligibilitySinglePage`` method determines if the current user is eligible to receive the configured MB reward. This function also starts a reward session on the server that can be completed later.

Input arguments
~~~~~~~~~~~~~~~
+------------+----------+----------+----------------------------------------------------------+
|    Key     |   Type   | Required |                       Description                        |
+------------+----------+----------+----------------------------------------------------------+
| campaignId | string   | yes      | ID for campaign setup by Aquto                           |
+------------+----------+----------+----------------------------------------------------------+
| callback   | function | yes      | Function called after checking eligibility on the server |
+------------+----------+----------+----------------------------------------------------------+

Response properties
~~~~~~~~~~~~~~~~~~~

+--------------+---------+----------+-------------------------------------------------------------------------+
|     Key      |   Type  | Optional |                               Description                               |
+--------------+---------+----------+-------------------------------------------------------------------------+
| eligible     | boolean | false    | Is the current user eligible for the reward?                            |
+--------------+---------+----------+-------------------------------------------------------------------------+
| userToken    | string  | false    |  Token that must be passed back to server when offer is completed       |
+--------------+---------+----------+-------------------------------------------------------------------------+
| rewardAmount | integer | true     | Reward amount in MB                                                     |
+--------------+---------+----------+-------------------------------------------------------------------------+
| rewardText   | string  | true     | Server configured string containing carrier and reward amount.          |
|              |         |          | Ex: Purchase any subscription and get 1GB added to your AT&T data plan. |
+--------------+---------+----------+-------------------------------------------------------------------------+
| carrier      | string  | true     | Code for user's carrier                                                 |
+--------------+---------+----------+-------------------------------------------------------------------------+


.. code-block:: html

  <div class="rewardBlock">
    <div class="rewardHeader"></div>
    <div class="rewardText"></div>
  </div>

.. code-block:: javascript

  var userToken
  aquto.checkEligibilitySinglePage({
    campaignId: '12345',
    callback: function(response) {
      userToken = response.useTokens
      if (response && response.eligible) {
        $('.rewardText').text(response.rewardText);
        $('.rewardHeader').addClass('rewardHeader'+response.carrier);
        $('.rewardBlock').show();
      }
    }
  });

Complete Reward
^^^^^^^^^^^^^^^

The ``complete`` method finishes the reward session and triggers the MB reward. The ``complete`` method must be executed within the same scope as the ``userToken``

Input arguments
~~~~~~~~~~~~~~~

+------------+----------+----------+----------------------------------------------------------+
|    Key     |   Type   | Required |                       Description                        |
+------------+----------+----------+----------------------------------------------------------+
| campaignId | string   | yes      | ID for campaign setup by Aquto                           |
+------------+----------+----------+----------------------------------------------------------+
| callback   | function | yes      | Function called after completing the reward on the server|
+------------+----------+----------+----------------------------------------------------------+

Response properties
~~~~~~~~~~~~~~~~~~~

+--------------+---------+----------+-----------------------------------------------------------------+
|     Key      |   Type  | Optional |                           Description                           |
+--------------+---------+----------+-----------------------------------------------------------------+
| eligible     | boolean | false    | Is the user still eligible for the reward                       |
+--------------+---------+----------+-----------------------------------------------------------------+
| rewardAmount | integer | true     | Reward amount in MB                                             |
+--------------+---------+----------+-----------------------------------------------------------------+
| rewardText   | string  | true     | Server configured string containing carrier and reward amount.  |
|              |         |          | Ex: Congratulations, you just added 1GB to your AT&T data plan! |
+--------------+---------+----------+-----------------------------------------------------------------+
| carrier      | string  | true     | Code for user's carrier                                         |
+--------------+---------+----------+-----------------------------------------------------------------+

.. code-block:: html

  <div class="rewardBlock">
    <div class="rewardHeader"></div>
    <div class="rewardText"></div>
  </div>

  <button onClick='complete()' />Finish</button>

.. code-block:: javascript

  var complete = function() {
    aquto.complete({
      campaignId: '12345',
      userToken: userToken,
      callback: function(response) {
        if (response && response.eligible) {
          $('.rewardText').text(response.rewardText);
          $('.rewardHeader').addClass('rewardHeader'+response.carrier);
          $('.rewardBlock').show();
        }
      }
    });
  }