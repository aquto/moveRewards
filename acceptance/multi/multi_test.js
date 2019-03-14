Feature('test');

Scenario('test', (I) => {
  I.amOnPage('/example/multiPage/', {'x-aqsim-phone': '14252368369'});
  //I.wait(30);
  I.waitForText('Exclusive offer for AT&T customers', 4);
  I.click('Continue');
  I.waitForText('Congratulations!', 4);
});
