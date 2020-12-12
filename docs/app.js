(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    var val = aliases[name];
    return (val && name !== val) ? expandAlias(val) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("action-sheet.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showSettings = void 0;

var _core = require("@ionic/core");

var showSettings = function showSettings(mdl) {
  var showAction = function showAction() {
    _core.actionSheetController.create({
      header: "Settings",
      buttons: [{
        handler: function handler() {
          mdl.state.mode = mdl.state.mode == "light" ? "dark" : "light";
          document.body.classList.toggle("dark");
          window.matchMedia("(prefers-color-scheme: dark)");
        },
        text: mdl.state.mode == "light" ? "Enter Dark Mode" : "Enter Light Mode"
      }]
    }).then(function (x) {
      return x.present();
    });
  };

  showAction();
};

exports.showSettings = showSettings;
});

;require.register("app.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = void 0;

var _layout = _interopRequireDefault(require("./components/layout.js"));

var _modal = _interopRequireDefault(require("./components/modal.js"));

var _post2 = _interopRequireDefault(require("./components/post.js"));

var _comment = _interopRequireDefault(require("./components/comment.js"));

var _index = require("./utils/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var IsLoading = m(".holder", [m(".preloader", [m("div"), m("div"), m("div"), m("div"), m("div"), m("div"), m("div")])]);
var plus = "M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z";
var minus = "M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-12v-2h12v2z";

var toUnFurl = function toUnFurl() {
  var bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  return bool ? m("path.highlight", {
    d: minus
  }) : m("path.highlight", {
    d: plus
  });
};

var userModalInfo = function userModalInfo(mdl) {
  return {
    init: function init(mdl) {
      return mdl.getDataById(mdl)("user")(mdl.state.user.id);
    },
    close: function close(mdl) {
      return mdl.toggleUser(mdl)("");
    },
    title: "User",
    contents: mdl.data.user && mdl.data.user.data ? [m("code.row", [m(".bold", "id: "), mdl.data.user.data.id]), m("code.row", [m(".bold", "created: "), mdl.data.user.data.created]), m("code.row", [m(".bold", "about: "), mdl.data.user.data.about]), m("code.row", [m(".bold", "karma: "), mdl.data.user.data.karma])] : [],
    footer: []
  };
};

var Component = function Component() {
  var isPost = function isPost(data) {
    return data.map;
  };

  var isComment = function isComment(data) {
    return data.comments && data.comments.map;
  };

  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      var route = mdl.state.route;
      var data = mdl.data[route].data;

      var showItem = function showItem(id) {
        var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
        mdl.state.title = title;
        mdl.state.id = id;
        mdl.state.showComment = !mdl.state.showComment;
      };

      return m("ion-list", {
        id: "component",
        route: mdl.state.route,
        onscroll: (0, _index.infiniteScroll)(mdl)
      }, [(0, _index.isEmpty)(data) ? m(".loader", IsLoading) : isPost(data) ? data.map(function (_post, idx) {
        return m(_post2["default"], {
          key: idx,
          post: _post,
          mdl: mdl,
          showItem: showItem
        });
      }) : isComment(data) && [m(".titleContainer", [m("button.backBtn", {
        onclick: function onclick() {
          return m.route.set(mdl.state.prev || "/news");
        }
      }, "Back"), m("h1.title", data.title)]), data.comments.map(function (c, idx) {
        return m(_comment["default"], {
          key: idx,
          comment: c,
          mdl: mdl
        });
      })], mdl.state.showUser && mdl.state.user.id && m(_modal["default"], _objectSpread(_objectSpread({}, userModalInfo(mdl)), {}, {
        mdl: mdl
      }))]);
    }
  };
};

var makeRoutes = function makeRoutes(mdl) {
  return function (routes, route) {
    routes["/".concat(route.name)] = {
      onmatch: function onmatch(_, path) {
        return (0, _index.init)(mdl)(path);
      },
      render: function render() {
        return m(_layout["default"], {
          mdl: mdl
        }, m(Component, {
          mdl: mdl
        }));
      }
    };
    return routes;
  };
};

var App = function App(mdl) {
  return mdl.routes.reduce(makeRoutes(mdl), {});
};

exports.App = App;
});

;require.register("components/Post.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var Post = {
  view: function view(_ref) {
    var _ref$attrs = _ref.attrs,
        mdl = _ref$attrs.mdl,
        showItem = _ref$attrs.showItem,
        _ref$attrs$post = _ref$attrs.post,
        comments_count = _ref$attrs$post.comments_count,
        domain = _ref$attrs$post.domain,
        id = _ref$attrs$post.id,
        points = _ref$attrs$post.points,
        time_ago = _ref$attrs$post.time_ago,
        title = _ref$attrs$post.title,
        url = _ref$attrs$post.url,
        user = _ref$attrs$post.user;
    return m("ion-item", {
      id: "".concat(id)
    }, [m(".top", [m("h1.title", title), m("code.subTitle", " from ", m("a.", {
      target: "_blank",
      href: url,
      rel: "noopener"
    }, "".concat(domain)))]), m(".bottom", [m(".left", [m(".top.highlight.cursor", {
      onclick: function onclick() {
        mdl.toggleUser(mdl)(user);
      }
    }, " by ".concat(user)), m("code.bottom", "".concat(time_ago))]), m(".right", [m("code.highlight.top", "".concat(points, " points")), toComment(comments_count)(showItem)(id, title)])])]);
  }
};
var _default = Post;
exports["default"] = _default;
});

;require.register("components/comment.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var Comment = {
  view: function view(_ref) {
    var _ref$attrs = _ref.attrs,
        key = _ref$attrs.key,
        mdl = _ref$attrs.mdl,
        _ref$attrs$comment = _ref$attrs.comment,
        comments = _ref$attrs$comment.comments,
        comments_count = _ref$attrs$comment.comments_count,
        id = _ref$attrs$comment.id,
        time_ago = _ref$attrs$comment.time_ago,
        content = _ref$attrs$comment.content,
        level = _ref$attrs$comment.level,
        user = _ref$attrs$comment.user;
    var state = {
      showComments: mdl.state.comment["".concat(key, "-").concat(level)] || false
    };
    return m(".commentContainer", {
      id: "".concat(id)
    }, [m(".", [m("a.highlight.cursor", {
      onclick: function onclick() {
        mdl.toggleUser(mdl)(user);
        console.log(user);
      }
    }, " ".concat(user)), m("code", " ".concat(time_ago))]), m(".nudgeRight", [m("code", m.trust(content)), comments_count ? m("button.commentBtn", {
      onclick: function onclick() {
        return mdl.toggleComments({
          mdl: mdl,
          key: key,
          level: level
        });
      }
    }, [m("svg.toggleCommentSvg", toUnFurl(state.showComments)), "".concat(comments_count, " comments")]) : "", state.showComments ? comments.map(function (c, idx) {
      return m(Comment, {
        key: idx,
        comment: c,
        mdl: mdl
      });
    }) : ""])]);
  }
};
var _default = Comment;
exports["default"] = _default;
});

;require.register("components/layout.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Toolbar = function Toolbar() {
  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return m("ion-header", m("ion-toolbar", m("ion-title", {
        size: "large"
      }, mdl.getPath(mdl.state.route))));
    }
  };
};

var Footer = function Footer(_ref2) {
  var mdl = _ref2.attrs.mdl;
  var Routes = mdl.routes.filter(function (r) {
    return r.name.split("/").length == 1;
  });
  return {
    view: function view(_ref3) {
      var mdl = _ref3.attrs.mdl;
      return m("ion-footer", m("ion-tab-bar", m("ion-tabs", [Routes.map(function (r) {
        return m("ion-tab", {
          tab: "".concat(r.name)
        });
      }), m("ion-tab-bar", {
        slot: "bottom"
      }, [Routes.map(function (r) {
        return m("ion-tab-button", {
          onclick: function onclick() {
            console.log("r.name", r.name);
            m.route.set("/".concat(r.name));
          },
          tab: "".concat(r.name)
        }, [m("ion-label", r.name), m("ion-icon", {
          name: r.icon
        })]);
      }), m("ion-tab-button", {
        onclick: function onclick() {
          return showSettings(mdl);
        }
      }, [m("ion-label", "settings"), m("ion-icon", {
        name: "ellipsis-vertical-outline"
      })])])])));
    }
  };
};

var Layout = function Layout(_ref4) {
  var mdl = _ref4.attrs.mdl;
  return {
    view: function view(_ref5) {
      var children = _ref5.children;
      return m("ion-app", children && [m(Toolbar, {
        mdl: mdl
      }), m("ion-content", children), m(Footer, {
        mdl: mdl
      })]);
    }
  };
};

var _default = Layout;
exports["default"] = _default;
});

;require.register("components/modal.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var Header = {
  view: function view(_ref) {
    var _ref$attrs = _ref.attrs,
        title = _ref$attrs.title,
        model = _ref$attrs.model,
        close = _ref$attrs.close;
    return m(".modal-header", [m("h4.title", title), m("button.closeBtn", {
      onclick: function onclick() {
        return close(model);
      }
    }, "X")]);
  }
};
var Content = {
  view: function view(_ref2) {
    var children = _ref2.children;
    return m(".modal-contents", children);
  }
};
var Footer = {
  view: function view(_ref3) {
    var children = _ref3.children;
    return m(".modal-footer", children);
  }
};
var Modal = {
  oninit: function oninit(_ref4) {
    var _ref4$attrs = _ref4.attrs,
        init = _ref4$attrs.init,
        model = _ref4$attrs.model;
    return init(model);
  },
  view: function view(_ref5) {
    var _ref5$attrs = _ref5.attrs,
        title = _ref5$attrs.title,
        contents = _ref5$attrs.contents,
        footer = _ref5$attrs.footer,
        model = _ref5$attrs.model,
        close = _ref5$attrs.close;
    return m("section.modalContainer", m(".modal", {}, [m(Header, {
      title: title,
      model: model,
      close: close
    }), m(Content, contents), m(Footer, footer)]));
  }
};
var _default = Modal;
exports["default"] = _default;
});

;require.register("components/post.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var toComment = function toComment(comments_count) {
  return function (showItem) {
    return function (id, title) {
      return comments_count ? m("ion-link", {
        "class": "bottom",
        href: "/item/".concat(id),
        onclick: function onclick() {
          return showItem(id, title);
        }
      }, m("ion-badge", "".concat(comments_count, " comments"))) : m("ion-badge", "".concat(comments_count, " comments"));
    };
  };
};

var Post = {
  view: function view(_ref) {
    var _ref$attrs = _ref.attrs,
        mdl = _ref$attrs.mdl,
        showItem = _ref$attrs.showItem,
        _ref$attrs$post = _ref$attrs.post,
        comments_count = _ref$attrs$post.comments_count,
        domain = _ref$attrs$post.domain,
        id = _ref$attrs$post.id,
        points = _ref$attrs$post.points,
        time_ago = _ref$attrs$post.time_ago,
        title = _ref$attrs$post.title,
        url = _ref$attrs$post.url,
        user = _ref$attrs$post.user;
    return m("ion-item", m("ion-grid", m("ion-header.ion-no-border", m("ion-toolbar", title)), m("ion-row", m("ion-link", "from ", m("a.", {
      target: "_blank",
      href: url,
      rel: "noopener"
    }, "".concat(domain)))), m("ion-item", {
      lines: "none"
    }, m("ion-badge", {
      slot: "start",
      onclick: function onclick() {
        return mdl.toggleUser(mdl)(user);
      }
    }, user), m("ion-badge", {
      slot: "end"
    }, points)), m("ion-item", {
      lines: "none"
    }, m("ion-badge", {
      slot: "start"
    }, time_ago), m("ion-badge", {
      slot: "end"
    }, toComment(comments_count)(showItem)(id, title)))));
  }
};
var _default = Post;
exports["default"] = _default;
});

;require.register("index.js", function(exports, require, module) {
"use strict";

var _model = require("./model.js");

var _app = require("./app.js");

var root = document.body;

if (module.hot) {
  module.hot.accept();
}

if ('development' !== "production") {
  console.log("Looks like we are in development mode!");
} // Styles


function getProfile(w) {
  if (w < 668) return "phone";
  if (w < 920) return "tablet";
  return "desktop";
}

var winW = window.innerWidth;
_model.model.state.profile = getProfile(winW);

function checkWidth() {
  var w = window.innerWidth;

  if (winW !== w) {
    winW = w;
    var lastProfile = _model.model.state.profile;
    _model.model.state.profile = getProfile(w);
    if (lastProfile != _model.model.state.profile) m.redraw();
  }

  requestAnimationFrame(checkWidth);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./service-worker.js").then(function (registration) {
      console.log("SW registered: ", registration);
    })["catch"](function (registrationError) {
      console.log("SW registration failed: ", registrationError);
    });
  });
}

checkWidth();
m.route(root, "/news", (0, _app.App)(_model.model));
m.route.set("/news");
});

;require.register("initialize.js", function(exports, require, module) {
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  require("./index.js");
});
});

;require.register("model.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.model = void 0;
var routes = [{
  name: "news",
  icon: "newspaper-outline"
}, {
  name: "newest",
  icon: "pulse-outline"
}, {
  name: "ask",
  icon: "chatbox-ellipses-outline"
}, {
  name: "show",
  icon: "eye-outline"
}, {
  name: "jobs",
  icon: "body-outline"
}, {
  name: "item/:key",
  icon: "newspaper-outline"
}, {
  name: "user/:key",
  icon: "newspaper-outline"
}];

var url = function url(route) {
  return function (page) {
    var path = route.split("/")[0];
    return "https://api.hnpwa.com/v0/".concat(path, "/").concat(page, ".json");
  };
};

var urls = routes.reduce(function (req, route) {
  req[route.name] = url(route.name);
  return req;
}, {});

var http = function http(mdl) {
  return function (url) {
    return function (route) {
      return m.request({
        url: url,
        method: "GET"
      }).then(function (data) {
        mdl.data[route].data = data;
        return mdl;
      });
    };
  };
};

var reqs = {
  urls: urls,
  http: http
};

var getData = function getData(mdl) {
  return function (route) {
    mdl.state.showComment = false;
    mdl.state.comment = {};
    mdl.state.route = route;
    var path = mdl.getPath(route);
    mdl.data[route] ? mdl.data[route] : mdl.data[route] = {
      data: []
    };
    mdl.reqs.http(mdl)(mdl.reqs.urls[path](mdl.state.page))(route);
  };
};

var getDataById = function getDataById(mdl) {
  return function (route) {
    return function (id) {
      mdl.state.prev = mdl.state.route;

      if (route == "item") {
        mdl.state.route = route;
      }

      mdl.data[route] ? mdl.data[route] : mdl.data[route] = {
        data: []
      };
      mdl.reqs.http(mdl)(mdl.reqs.urls["".concat(route, "/:key")](id))(route);
    };
  };
};

var getPath = function getPath(route) {
  return route.split("/")[1];
};

var state = {
  key: "",
  url: "",
  route: "",
  page: 1,
  profile: "",
  tabsShowing: false,
  title: "",
  comment: {},
  showModal: false,
  showUser: false,
  user: {
    id: ""
  }
};

var toggleComments = function toggleComments(_ref) {
  var mdl = _ref.mdl,
      key = _ref.key,
      level = _ref.level;
  return mdl.state.comment["".concat(key, "-").concat(level)] ? mdl.state.comment["".concat(key, "-").concat(level)] = !mdl.state.comment["".concat(key, "-").concat(level)] : mdl.state.comment["".concat(key, "-").concat(level)] = true;
};

var toggleModal = function toggleModal(mdl) {
  return mdl.state.showModal = !mdl.state.showModal;
};

var toggleUser = function toggleUser(mdl) {
  return function (id) {
    mdl.state.user.id = id;
    mdl.state.showUser = !mdl.state.showUser;
  };
};

var model = {
  getData: getData,
  getDataById: getDataById,
  routes: routes,
  getPath: getPath,
  reqs: reqs,
  data: {},
  state: state,
  toggleComments: toggleComments,
  toggleModal: toggleModal,
  toggleUser: toggleUser
};
exports.model = model;
});

;require.register("toast.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _core = require("@ionic/core");

var Toast = function Toast() {
  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return m('ion-toast', {
        oncreate: function oncreate(_ref2) {
          var dom = _ref2.dom;

          _core.toastController.create({
            component: dom,
            message: mdl.toast.msg(),
            duration: mdl.toast.duration(),
            showCloseButton: true,
            animated: true,
            color: mdl.toast.status() ? 'success' : 'danger'
          }).then(function (toast) {
            return toast.present();
          });
        }
      });
    }
  };
};

var _default = Toast;
exports["default"] = _default;
});

;require.register("utils/animations.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.animateChildrenLimitsExit = exports.slideOutAnimation = exports.animate = exports.animateChildrenLimitsEntrance = exports.animateChildrenEntrance = exports.animateFooterEntrance = exports.animateModalEntrance = exports.animateHeaderEntrance = exports.animateComponentEntrance = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var animateComponentEntrance = function animateComponentEntrance(idx) {
  return function (_ref) {
    var dom = _ref.dom;
    dom.style.opacity = 0;
    return setTimeout(function () {
      dom.classList.toggle('expandOpen');
      dom.style.opacity = 1;
    }, idx * 100 + 20);
  };
};

exports.animateComponentEntrance = animateComponentEntrance;

var animateHeaderEntrance = function animateHeaderEntrance(_ref2) {
  var dom = _ref2.dom;
  dom.style.opacity = 0;
  dom.classList.toggle('slideRight');
  dom.style.opacity = 1;
};

exports.animateHeaderEntrance = animateHeaderEntrance;

var animateModalEntrance = function animateModalEntrance(_ref3) {
  var dom = _ref3.dom;
  dom.style.opacity = 0;
  dom.classList.toggle('expandOpen');
  dom.style.opacity = 1;
};

exports.animateModalEntrance = animateModalEntrance;

var animateFooterEntrance = function animateFooterEntrance(_ref4) {
  var dom = _ref4.dom;
  dom.style.opacity = 0;
  dom.classList.toggle('slideLeft');
  dom.style.opacity = 1;
};

exports.animateFooterEntrance = animateFooterEntrance;

var animateChildrenEntrance = function animateChildrenEntrance(_ref5) {
  var dom = _ref5.dom;

  var children = _toConsumableArray(dom.children);

  return children.map(function (child, idx) {
    child.style.opacity = 0;
    setTimeout(function () {
      child.classList.toggle('slideRight');
      child.style.opacity = 1;
    }, (idx + 1) * 10);
  });
};

exports.animateChildrenEntrance = animateChildrenEntrance;

var animateChildrenLimitsEntrance = function animateChildrenLimitsEntrance(idx) {
  return function (_ref6) {
    var dom = _ref6.dom;
    dom.style.opacity = 0;
    setTimeout(function () {
      dom.classList.toggle('slideDown');
      dom.style.opacity = 1;
    }, (idx + 1) * 200);
  };
};

exports.animateChildrenLimitsEntrance = animateChildrenLimitsEntrance;

var animate = function animate(dir) {
  return function (_ref7) {
    var dom = _ref7.dom;
    dom.style.opacity = 0;
    setTimeout(function () {
      dom.classList.toggle(dir);
      dom.style.opacity = 1;
    }, 200);
  };
};

exports.animate = animate;

var slideOutAnimation = function slideOutAnimation(_ref8) {
  var dom = _ref8.dom;
  console.log(dom);
  return new Promise(function () {
    dom.classList.remove('expandOpen');
    return setTimeout(function () {
      dom.style.opacity = 0; // dom.classList.add('reverseAnimation', 'hatch')
    }, 200);
  });
};

exports.slideOutAnimation = slideOutAnimation;

var animateChildrenLimitsExit = function animateChildrenLimitsExit(_ref9) {
  var dom = _ref9.dom;
  return new Promise(function () {
    _toConsumableArray(dom.children).reverse().map(function (child, idx) {
      return setTimeout(function () {
        child.style.display = 'none';
      }, idx * 100);
    });
  });
};

exports.animateChildrenLimitsExit = animateChildrenLimitsExit;
});

;require.register("utils/helpers.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = exports.infiniteScroll = exports.isEmpty = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var isEmpty = function isEmpty(data) {
  return data.length == 0;
};

exports.isEmpty = isEmpty;

var infiniteScroll = function infiniteScroll(mdl) {
  return function (e) {
    var route = mdl.state.route;
    var length = mdl.data[route].data.length;
    var setpoint = 10 * length * mdl.state.scrollPos;

    if (e.target.scrollTop - mdl.state.scrollPos >= setpoint) {
      mdl.state.scrollPos++ + e.target.scrollTop;

      if (length < mdl.data[route].limit) {
        mdl.getData(mdl)(route);
      }
    }
  };
};

exports.infiniteScroll = infiniteScroll;

var init = function init(mdl) {
  return function (path) {
    mdl.state.page = 1;

    var _path$split = path.split("/"),
        _path$split2 = _slicedToArray(_path$split, 3),
        _ = _path$split2[0],
        route = _path$split2[1],
        id = _path$split2[2];

    return id ? mdl.getDataById(mdl)(route)(id) : mdl.getData(mdl)(path);
  };
};

exports.init = init;
});

;require.register("utils/index.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _animations = require("./animations.js");

Object.keys(_animations).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _animations[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _animations[key];
    }
  });
});

var _helpers = require("./helpers.js");

Object.keys(_helpers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _helpers[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _helpers[key];
    }
  });
});
});

;require.register("___globals___", function(exports, require, module) {
  

// Auto-loaded modules from config.npm.globals.
window.m = require("mithril");
window.Stream = require("mithril-stream");


});})();require('___globals___');


//# sourceMappingURL=app.js.map