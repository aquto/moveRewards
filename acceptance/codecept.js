exports.config = {
  "tests": "./single/*_test.js",
  "timeout": 10000,
  "output": "./output",
  "helpers_old": {
    "WebDriverIO": {
      "url": "http://localhost:8040",
      "browser": "firefox"
    }
  },
  "helpers": {
    "Nightmare": {
      "url": "http://localhost:8040",
      "show": true,
      "width": 1300,
      "height": 700,
      "useContentSize": true,
    }
  },
  "include": {},
  "bootstrap": false,
  "mocha": {},
  "name": "acceptance"
};
