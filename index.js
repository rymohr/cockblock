function cockblock(html, options) {
  return sanitizeHtml(html, options || cockblock.defaults);
}

function $wrap(value) {
  cockblock.$ = cockblock.$ || window.$;

  if (!cockblock.$) {
    throw new Error("cockblock.$ must be set to cheerio to jquery");
  }

  return cockblock.$(value);
}

cockblock.url = function(url, options) {
  return sanitizeResource(url, options || cockblock.defaults);
};

// Exposed for testing
// TODO: expose these under cockblock.utils instead
cockblock._sanitizeAttributes = sanitizeAttributes;
cockblock._getAttributeName = getAttributeName;

cockblock.defaults = {
  elements: [
    "a",
    "aside",
    "b",
    "blockquote",
    "br",
    "caption",
    "code",
    "del",
    "dd",
    "dfn",
    "div",
    "dl",
    "dt",
    "em",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "hr",
    "i",
    "img",
    "ins",
    "kbd",
    "li",
    "ol",
    "p",
    "pre",
    "q",
    "samp",
    "span",
    "strike",
    "strong",
    "sub",
    "sup",
    "table",
    "tbody",
    "td",
    "tfoot",
    "th",
    "thead",
    "tr",
    "tt",
    "ul",
    "var"
  ],

  attributes: {
    "a": ["href"],
    "img": ["src"],
    "div": ["itemscope", "itemtype"],
    "all": [
      "abbr",
      "accept",
      "accept-charset",
      "accesskey",
      "action",
      "align",
      "alt",
      "axis",
      "border",
      "cellpadding",
      "cellspacing",
      "char",
      "charoff",
      "charset",
      "checked",
      "cite",
      "clear",
      "cols",
      "colspan",
      "color",
      "compact",
      "coords",
      // "data-[a-z0-9-]+",
      "datetime",
      "dir",
      "disabled",
      "enctype",
      "for",
      "frame",
      "headers",
      "height",
      "hreflang",
      "hspace",
      "ismap",
      "label",
      "lang",
      "longdesc",
      "maxlength",
      "media",
      "method",
      "multiple",
      "name",
      "nohref",
      "noshade",
      "nowrap",
      "prompt",
      "readonly",
      "rel",
      "rev",
      "rows",
      "rowspan",
      "rules",
      "scope",
      "selected",
      "shape",
      "size",
      "span",
      "start",
      "summary",
      "tabindex",
      "target",
      "title",
      "type",
      "usemap",
      "valign",
      "value",
      "vspace",
      "width",
      "itemprop"
    ]
  },

  // Default protocol support includes http(s), mailto, and relative.
  // TODO: Support protocol resolution too? //example.com
  protocols: /^(http|https|mailto|#|\/)/i
};

var CONTAINED = {};
CONTAINED.thead = CONTAINED.tbody = CONTAINED.tfoot = /^table$/i;
CONTAINED.tr = /^(table|thead|tbody|tfoot)$/i;
CONTAINED.th = CONTAINED.td = /^tr$/i;
CONTAINED.li = /^(ul|ol)$/i;

// src: img, iframe
// href: a
var RESOURCEFUL = /^(src|href)$/;

function sanitizeHtml(html, options) {
  var $wrapper = $wrap("<body>");
  $wrapper.html(html);
  sanitizeChildren($wrapper, initializeOptions(options));
  return $wrapper.html();
}

function initializeOptions(options) {
  var opts = {};
  opts.protocols = options.protocols;
  opts.elements = arrayToRegExp(options.elements);
  opts.attributes = {};
  for (var tagName in options.attributes) {
    var attributes = options.attributes[tagName];
    if (tagName != "all") attributes = attributes.concat(options.attributes.all);
    opts.attributes[tagName] = arrayToRegExp(attributes);
  }
  return opts;
}

function arrayToRegExp(array) {
  return new RegExp("^(" + array.join("|") + ")$", "i");
}

function sanitizeElement($el, options) {
  if (options.elements.test(getTagName($el)) && isContained($el)) {
    sanitizeAttributes($el, options);
    sanitizeChildren($el, options);
    return $el;
  } else {
    $el.remove();
  }
}

function sanitizeChildren($el, options) {
  $el.children().each(function() {
    sanitizeElement($wrap(this), options);
  });
}

// List and table items must be contained or they can break out.
function isContained($el) {
  var requiredParent = CONTAINED[getTagNameLower($el)];
  return !requiredParent || requiredParent.test(getTagName($el.parent()));
}

function sanitizeAttributes($el, options) {
  var tagName = getTagNameLower($el);
  var attribute, attributes = getAttributes($el);
  var whitelist = options.attributes[tagName] || options.attributes.all;

  for (var index in attributes) {
    if (attributes.hasOwnProperty(index)) {
      if ((attribute = getAttributeName(attributes, index))) {
        if (whitelist.test(attribute)) {
          sanitizeAttribute($el, attribute, options);
        } else {
          $el.removeAttr(attribute);
        }
      }
    }
  }
}

function sanitizeAttribute($el, attribute, options) {
  if (RESOURCEFUL.test(attribute)) {
    $el.attr(attribute, sanitizeResource($el.attr(attribute), options));
  }
}

function sanitizeResource(value, options) {
  return (value && options.protocols.test(value)) ? value : '';
}

// Conformity helpers since cheerio couldn't go the easy route and just
// use the same variable names browsers do.
function getTagName($el) {
  return $el[0].tagName || $el[0].name;
}

function getTagNameLower($el) {
  return getTagName($el).toLowerCase();
}

function getAttributes($el) {
  return $el[0].attributes || $el[0].attribs;
}

// In the browser the attributes object looks like:
// {"0": {"name": "class"}, "1": ...}
//
// In node / cheerio the attributes are keyed by name instead.
//
// - in IE9 it's possible for attribute to be undefined (issue #1)
function getAttributeName(attributes, index) {
  if (Number(index) == index) {
    var attribute = attributes[String(index)];
    return attribute && attribute.name;
  } else {
    return index;
  }
}

module.exports = cockblock;
