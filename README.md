cockblock
======

Simple whitelist-based html sanitizer inspired by the `SanitizationFilter`
in GitHub's [html-pipeline][html-pipeline] library.

Works in node (through [cheerio][cheerio]) and in the browser
(through [jquery][jquery]), and weighs in ~ 2kb minimized.

# API

```js
var cockblock = require("cockblock");
cockblock(html[, options]);     // Returns sanitized html
cockblock.url(url[, options]);  // Returns sanitized url
```

In the browser, just include [jquery][jquery] and [cockblock.js](dist):

```
<script src="path/to/jquery.js" type="text/javascript"></script>
<script src="path/to/cockblock.js" type="text/javascript"></script>
```

# Options

The library comes with a sensible set of defaults. You can override them
through `cockblock.defaults` or simply pass the options inline.

```js
// Simplified example that only permits <a>, <em> and <strong> elements.
// Titles are permitted on all elements and links can also include href.
// Only absolute http(s) links are permitted.
cockblock.defaults = {
  elements: ["a", "em", "strong"],

  attributes: {
    "a": ["href"],
    "all": ["title"]
  },

  protocols: /^(http|https)/i
};
```

See [lib/cockblock.js][source] for the default set of allowed elements, attributes, and
supported protocols.

# Contributing

Want to contribute? Great! Open an issue if you've found a bug, and pull
requests are always welcome.

```
git clone https://github.com/kumu/cockblock && cd cockblock
npm install -g mocha
npm install
make test          # run tests within console / cheerio
make test-browser  # run tests within browser / jquery
```

[source]: https://github.com/kumu/cockblock.js/blob/master/lib/cockblock.js
[dist]: https://github.com/kumu/cockblock.js/blob/master/dist/cockblock.js
[html-pipeline]: https://github.com/jch/html-pipeline
[cheerio]: https://github.com/MatthewMueller/cheerio
[jquery]: https://github.com/jquery/jquery
