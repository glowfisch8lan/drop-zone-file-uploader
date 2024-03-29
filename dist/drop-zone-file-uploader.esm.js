import _ from 'lodash';

function truncate(text, length, clamp){
    clamp = clamp || '...';
    var node = document.createElement('div');
    node.innerHTML = text;
    var content = node.textContent;
    return content.length > length ? content.slice(0, length) + clamp : content;
}

//

var script = {
  name: "DropZone",
  props: {
    disablePreview: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 5,
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      file: "",
      files: [],
      dragging: false,
    };
  },
  methods: {
    getImgSrc: function getImgSrc(file) {
      return URL.createObjectURL(file)
    },
    calculateFileSize: function calculateFileSize(size) {
      return (size / 1000000).toFixed(2) + "MB";
    },
    truncate: function truncate$1(text, length, clamp) {
      return truncate(text, length, clamp)
    },
    onChange: function onChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        this.dragging = false;
        return;
      }
      this.createFiles(files);
    },
    createFiles: function createFiles(files) {
      var this$1 = this;

      if (!files.length) {
        this.dragging = false;
        return;
      }
      _.forEach(files, function (file) {
        if (file.size > this$1.size * 1000000) {
          alert("please check file size no over 5 MB.");
          this$1.dragging = false;
          return;
        }
        if (!this$1.multiple) {
          this$1.files = [];
        }
        this$1.files.push(file);
        this$1.dragging = false;
      });
      this.$emit("input", this.files);
    },
    removeFile: function removeFile(file) {
      var index = this.files.findIndex(function (fileObject) { return file.name === fileObject.name; });
      this.files.splice(index, 1);
      this.$emit("input", this.files);
    },
  },
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    var options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    var hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            var originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            var existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

var isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return function (id, style) { return addStyle(id, style); };
}
var HEAD;
var styles = {};
function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        var code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                { style.element.setAttribute('media', css.media); }
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            var index = style.ids.size - 1;
            var textNode = document.createTextNode(code);
            var nodes = style.element.childNodes;
            if (nodes[index])
                { style.element.removeChild(nodes[index]); }
            if (nodes.length)
                { style.element.insertBefore(textNode, nodes[index]); }
            else
                { style.element.appendChild(textNode); }
        }
    }
}

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "v-card",
    { staticClass: "my-2", attrs: { elevation: "0" } },
    [
      _c(
        "v-card-text",
        {
          class: ["dropZone", "py-3", _vm.dragging ? "overlay" : ""],
          on: {
            dragenter: function ($event) {
              _vm.dragging = true;
            },
            dragleave: function ($event) {
              _vm.dragging = false;
            },
          },
        },
        [
          _c(
            "div",
            {
              staticClass: "d-flex justify-center",
              on: { drag: _vm.onChange },
            },
            [
              _c("v-icon", { attrs: { large: "", left: "" } }, [
                _vm._v("mdi-cloud-upload-outline") ]),
              _vm._v(" "),
              _c("span", [
                _vm._v(
                  "\n                  Перетащите или нажмите для загрузки\n                  "
                ),
                _c("br"),
                _vm._v(
                  "\n                  Максимальный размер файлов: " +
                    _vm._s(_vm.size) +
                    "MB\n              "
                ) ]) ],
            1
          ),
          _vm._v(" "),
          _c("input", {
            attrs: { type: "file", multiple: _vm.multiple },
            on: { change: _vm.onChange },
          }) ]
      ),
      _vm._v(" "),
      _vm.files.length > 0
        ? _c(
            "v-card-text",
            {},
            _vm._l(_vm.files, function (file, index) {
              return _c(
                "div",
                { key: index, staticClass: "d-flex pb-2" },
                [
                  _vm.disablePreview
                    ? _c("img", {
                        staticStyle: { width: "10vw" },
                        attrs: { src: _vm.getImgSrc(file) },
                      })
                    : _vm._e(),
                  _vm._v(" "),
                  _c(
                    "span",
                    { staticClass: "ml-3" },
                    [
                      _c("div", [
                        _vm._v(
                          "\n                      Имя файла: " +
                            _vm._s(_vm.truncate(file.name, 10, "...")) +
                            "\n                      "
                        ),
                        _c("br"),
                        _vm._v(
                          "\n                      Размер: " +
                            _vm._s(_vm.calculateFileSize(file.size)) +
                            "\n                  "
                        ) ]),
                      _vm._v(" "),
                      _c(
                        "v-btn",
                        {
                          attrs: { color: "error", "x-small": "" },
                          on: {
                            click: function ($event) {
                              return _vm.removeFile(file)
                            },
                          },
                        },
                        [
                          _vm._v(
                            "\n                      Удалить\n                  "
                          ) ]
                      ) ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-icon",
                    {
                      staticClass: "ml-auto success--text",
                      attrs: { right: "" },
                    },
                    [_vm._v("\n        mdi-cloud-check-outline\n      ")]
                  ) ],
                1
              )
            }),
            0
          )
        : _vm._e() ],
    1
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-016b39ef_0", { source: ".dropZone[data-v-016b39ef] {\n  position: relative;\n  border: 5px dashed #eee;\n}\n.dropZone[data-v-016b39ef]:hover {\n  border: 5px dashed #2e94c4;\n}\n.dropZone .overlay[data-v-016b39ef] {\n  background: #5c5c5c;\n  opacity: 0.8;\n}\n.dropZone input[data-v-016b39ef] {\n  position: absolute;\n  cursor: pointer;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n}\n\n/*# sourceMappingURL=DropZone.vue.map */", map: {"version":3,"sources":["/home/admin/projects/vue/drop-zone-file-uploader/src/DropZone.vue","DropZone.vue"],"names":[],"mappings":"AAmHA;EACA,kBAAA;EACA,uBAAA;AClHA;ADoHA;EACA,0BAAA;AClHA;ADqHA;EACA,mBAAA;EACA,YAAA;ACnHA;ADuHA;EACA,kBAAA;EACA,eAAA;EACA,MAAA;EACA,QAAA;EACA,SAAA;EACA,OAAA;EACA,WAAA;EACA,YAAA;EACA,UAAA;ACpHA;;AAEA,uCAAuC","file":"DropZone.vue","sourcesContent":["<template>\n  <v-card elevation=\"0\" class=\"my-2\">\n    <v-card-text\n        :class=\"['dropZone', 'py-3', dragging ? 'overlay' : '']\"\n        @dragenter=\"dragging = true\"\n        @dragleave=\"dragging = false\"\n    >\n      <div class=\"d-flex justify-center\" @drag=\"onChange\">\n        <v-icon large left>mdi-cloud-upload-outline</v-icon>\n\n        <span>\n                    Перетащите или нажмите для загрузки\n                    <br/>\n                    Максимальный размер файлов: {{ size }}MB\n                </span>\n      </div>\n      <input type=\"file\" @change=\"onChange\" :multiple=\"multiple\"/>\n    </v-card-text>\n\n    <v-card-text v-if=\"files.length > 0\" class=\"\">\n      <div class=\"d-flex pb-2\" v-for=\"(file, index) in files\" :key=\"index\">\n        <!--        <v-icon x-large left>mdi-file-outline</v-icon>-->\n        <img :src=\"getImgSrc(file)\" style=\"width:10vw\" v-if=\"disablePreview\">\n        <span class=\"ml-3\">\n                    <div>\n                        Имя файла: {{ truncate(file.name, 10, '...') }}\n                        <br/>\n                        Размер: {{ calculateFileSize(file.size) }}\n                    </div>\n                    <v-btn color=\"error\" x-small @click=\"removeFile(file)\">\n                        Удалить\n                    </v-btn>\n                </span>\n        <v-icon right class=\"ml-auto success--text\">\n          mdi-cloud-check-outline\n        </v-icon>\n      </div>\n    </v-card-text>\n  </v-card>\n</template>\n\n<script>\nimport _ from \"lodash\";\nimport truncate from \"./helpers/truncate\";\n\nexport default {\n  name: \"DropZone\",\n  props: {\n    disablePreview: {\n      type: Boolean,\n      default: false,\n    },\n    size: {\n      type: Number,\n      default: 5,\n    },\n    multiple: {\n      type: Boolean,\n      default: false\n    }\n  },\n  data() {\n    return {\n      file: \"\",\n      files: [],\n      dragging: false,\n    };\n  },\n  methods: {\n    getImgSrc(file) {\n      return URL.createObjectURL(file)\n    },\n    calculateFileSize(size) {\n      return (size / 1000000).toFixed(2) + \"MB\";\n    },\n    truncate(text, length, clamp) {\n      return truncate(text, length, clamp)\n    },\n    onChange(e) {\n      const files = e.target.files || e.dataTransfer.files;\n      if (!files.length) {\n        this.dragging = false;\n        return;\n      }\n      this.createFiles(files);\n    },\n    createFiles(files) {\n      if (!files.length) {\n        this.dragging = false;\n        return;\n      }\n      _.forEach(files, (file) => {\n        if (file.size > this.size * 1000000) {\n          alert(\"please check file size no over 5 MB.\");\n          this.dragging = false;\n          return;\n        }\n        if (!this.multiple) {\n          this.files = []\n        }\n        this.files.push(file);\n        this.dragging = false;\n      })\n      this.$emit(\"input\", this.files);\n    },\n    removeFile(file) {\n      let index = this.files.findIndex((fileObject) => file.name === fileObject.name)\n      this.files.splice(index, 1);\n      this.$emit(\"input\", this.files);\n    },\n  },\n};\n</script>\n\n<style scoped lang=\"scss\">\n.dropZone {\n  position: relative;\n  border: 5px dashed #eee;\n\n  &:hover {\n    border: 5px dashed #2e94c4;\n  }\n\n  .overlay {\n    background: #5c5c5c;\n    opacity: 0.8;\n  }\n}\n\n.dropZone input {\n  position: absolute;\n  cursor: pointer;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n}\n</style>\n",".dropZone {\n  position: relative;\n  border: 5px dashed #eee;\n}\n.dropZone:hover {\n  border: 5px dashed #2e94c4;\n}\n.dropZone .overlay {\n  background: #5c5c5c;\n  opacity: 0.8;\n}\n\n.dropZone input {\n  position: absolute;\n  cursor: pointer;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n}\n\n/*# sourceMappingURL=DropZone.vue.map */"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = "data-v-016b39ef";
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

function install(Vue) {
    if (install.installed) { return; }
    install.installed = true;
    Vue.component('DropZone', __vue_component__);
}

var plugin = {
    install: install,
};

var GlobalVue = null;
if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
}
if (GlobalVue) {
    GlobalVue.use(plugin);
}

export default __vue_component__;
export { install };
