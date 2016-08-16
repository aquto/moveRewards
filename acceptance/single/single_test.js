Feature('test');

Scenario('test', (I) => {
  I.amOnPage('/example/singlePage/', {'x-aqsim-phone': '14042424546'});
  ///I.wait(30);
  I.waitForText('Exclusive offer for AT&T customers', 4);
  I.click('Complete');
  I.waitForText('Success!', 4);
});
