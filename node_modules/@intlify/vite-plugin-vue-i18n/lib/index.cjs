'use strict';

const fs = require('fs');
const path = require('path');
const shared = require('@intlify/shared');
const pluginutils = require('@rollup/pluginutils');
const bundleUtils = require('@intlify/bundle-utils');
const fg = require('fast-glob');
const createDebug = require('debug');
const vite = require('vite');
const qs = require('querystring');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

const path__default = /*#__PURE__*/_interopDefaultLegacy(path);
const fg__default = /*#__PURE__*/_interopDefaultLegacy(fg);
const createDebug__default = /*#__PURE__*/_interopDefaultLegacy(createDebug);
const qs__default = /*#__PURE__*/_interopDefaultLegacy(qs);

function parseVueRequest(id) {
  const [filename, rawQuery] = id.split(`?`, 2);
  const query = qs__default.parse(rawQuery);
  const langPart = Object.keys(query).find((key) => /lang\./i.test(key));
  if (query.vue != null) {
    query.vue = true;
  }
  if (query.src != null) {
    query.src = true;
  }
  if (query.index != null) {
    query.index = Number(query.index);
  }
  if (query.raw != null) {
    query.raw = true;
  }
  if (langPart) {
    const [, lang] = langPart.split(".");
    query.lang = lang;
  }
  return {
    filename,
    query
  };
}

const debug = createDebug__default("vite-plugin-vue-i18n:index");
const INTLIFY_BUNDLE_IMPORT_ID = "@intlify/vite-plugin-vue-i18n/messages";
const installedPkg = bundleUtils.checkInstallPackage("@intlify/vite-plugin-vue-i18n", debug);
const installedVueI18nBridge = bundleUtils.checkVueI18nBridgeInstallPackage(debug);
const VIRTUAL_PREFIX = "\0";
function getVirtualId(id) {
  return id.startsWith(VIRTUAL_PREFIX) ? id.slice(VIRTUAL_PREFIX.length) : null;
}
function asVirtualId(id) {
  return VIRTUAL_PREFIX + id;
}
function pluginI18n(options = { forceStringify: false }) {
  debug("plugin options:", options);
  let include = options.include;
  if (include) {
    if (shared.isArray(include)) {
      include = include.map((item) => vite.normalizePath(item));
    } else if (shared.isString(include)) {
      include = vite.normalizePath(include);
    }
  }
  const filter = pluginutils.createFilter(include);
  const runtimeOnly = shared.isBoolean(options.runtimeOnly) ? options.runtimeOnly : true;
  const compositionOnly = installedPkg === "vue-i18n" ? shared.isBoolean(options.compositionOnly) ? options.compositionOnly : true : true;
  const fullInstall = installedPkg === "vue-i18n" ? shared.isBoolean(options.fullInstall) ? options.fullInstall : true : false;
  const defaultSFCLang = shared.isString(options.defaultSFCLang) ? options.defaultSFCLang : void 0;
  const globalSFCScope = !!options.globalSFCScope;
  const useVueI18nImportName = options.useVueI18nImportName;
  if (useVueI18nImportName != null) {
    console.warn(
      `[vite-plugin-vue-i18n]: 'useVueI18nImportName' option is experimental`
    );
  }
  const getAliasName = () => installedVueI18nBridge && installedPkg === "vue-i18n" ? "vue-i18n-bridge" : installedPkg === "petite-vue-i18n" && shared.isBoolean(useVueI18nImportName) && useVueI18nImportName ? "vue-i18n" : `${installedPkg}`;
  const forceStringify = !!options.forceStringify;
  let isProduction = false;
  let sourceMap = false;
  return {
    name: "vite-plugin-vue-i18n",
    enforce: "pre",
    config(config, { command }) {
      const aliasName = getAliasName();
      debug(`alias name: ${aliasName}`);
      if (command === "build" && runtimeOnly) {
        normalizeConfigResolveAlias(config);
        if (shared.isArray(config.resolve.alias)) {
          config.resolve.alias.push({
            find: aliasName,
            replacement: `${aliasName}/dist/${aliasName}.runtime.esm-bundler.js`
          });
        } else {
          config.resolve.alias[aliasName] = `${aliasName}/dist/${aliasName}.runtime.esm-bundler.js`;
        }
        debug(
          `set ${aliasName} runtime only: ${aliasName}/dist/${aliasName}.runtime.esm-bundler.js`
        );
      } else if (command === "serve" && installedPkg === "petite-vue-i18n" && useVueI18nImportName) {
        normalizeConfigResolveAlias(config);
        if (shared.isArray(config.resolve.alias)) {
          config.resolve.alias.push({
            find: "vue-i18n",
            replacement: `petite-vue-i18n/dist/petite-vue-i18n.esm-bundler.js`
          });
        } else {
          config.resolve.alias["vue-i18n"] = `petite-vue-i18n/dist/petite-vue-i18n.esm-bundler.js`;
        }
        debug(`alias name: ${aliasName}`);
      }
      config.define = config.define || {};
      config.define["__VUE_I18N_LEGACY_API__"] = !compositionOnly;
      debug(
        `set __VUE_I18N_LEGACY_API__ is '${config.define["__VUE_I18N_LEGACY_API__"]}'`
      );
      config.define["__VUE_I18N_FULL_INSTALL__"] = fullInstall;
      debug(
        `set __VUE_I18N_FULL_INSTALL__ is '${config.define["__VUE_I18N_FULL_INSTALL__"]}'`
      );
      config.define["__VUE_I18N_PROD_DEVTOOLS__"] = false;
    },
    configResolved(config) {
      isProduction = config.isProduction;
      sourceMap = config.command === "build" ? !!config.build.sourcemap : false;
      const jsonPlugin = config.plugins.find((p) => p.name === "vite:json");
      if (jsonPlugin) {
        const orgTransform = jsonPlugin.transform;
        jsonPlugin.transform = async function(code, id) {
          if (!/\.json$/.test(id) || filter(id)) {
            return;
          }
          const { query } = parseVueRequest(id);
          if (query.vue) {
            return;
          }
          debug("org json plugin");
          return orgTransform.apply(this, [code, id]);
        };
      }
    },
    resolveId(id) {
      if (id === INTLIFY_BUNDLE_IMPORT_ID) {
        return asVirtualId(id);
      }
    },
    async load(id) {
      if (getVirtualId(id) === INTLIFY_BUNDLE_IMPORT_ID && include) {
        let resourcePaths = [];
        const includePaths = shared.isArray(include) ? include : [include];
        for (const inc of includePaths) {
          resourcePaths = [...resourcePaths, ...await fg__default(inc)];
        }
        resourcePaths = resourcePaths.filter(
          (el, pos) => resourcePaths.indexOf(el) === pos
        );
        const code = await generateBundleResources(
          resourcePaths,
          isProduction,
          forceStringify
        );
        return {
          code,
          map: { mappings: "" }
        };
      }
    },
    async handleHotUpdate({ file, server }) {
      if (/\.(json5?|ya?ml)$/.test(file)) {
        const module = server.moduleGraph.getModuleById(
          asVirtualId(INTLIFY_BUNDLE_IMPORT_ID)
        );
        if (module) {
          server.moduleGraph.invalidateModule(module);
          return [module];
        }
      }
    },
    async transform(code, id) {
      const { filename, query } = parseVueRequest(id);
      debug("transform", id, JSON.stringify(query));
      let langInfo = "json";
      let inSourceMap;
      if (!query.vue) {
        if (/\.(json5?|ya?ml)$/.test(id) && filter(id)) {
          langInfo = path__default.parse(filename).ext;
          const generate = /\.?json5?/.test(langInfo) ? bundleUtils.generateJSON : bundleUtils.generateYAML;
          const parseOptions = getOptions(
            filename,
            isProduction,
            query,
            sourceMap,
            inSourceMap,
            globalSFCScope,
            forceStringify
          );
          debug("parseOptions", parseOptions);
          const { code: generatedCode, map } = generate(code, parseOptions);
          debug("generated code", generatedCode, id);
          debug("sourcemap", map, id);
          if (code === generatedCode)
            return;
          return {
            code: generatedCode,
            map: sourceMap ? map : { mappings: "" }
          };
        }
      } else {
        if (isCustomBlock(query)) {
          if (shared.isString(query.lang)) {
            langInfo = query.src ? query.lang === "i18n" ? "json" : query.lang : query.lang;
          } else if (defaultSFCLang) {
            langInfo = defaultSFCLang;
          }
          const generate = /\.?json5?/.test(langInfo) ? bundleUtils.generateJSON : bundleUtils.generateYAML;
          const parseOptions = getOptions(
            filename,
            isProduction,
            query,
            sourceMap,
            inSourceMap,
            globalSFCScope,
            forceStringify
          );
          debug("parseOptions", parseOptions);
          const { code: generatedCode, map } = generate(code, parseOptions);
          debug("generated code", generatedCode, id);
          debug("sourcemap", map, id);
          if (code === generatedCode)
            return;
          return {
            code: generatedCode,
            map: sourceMap ? map : { mappings: "" }
          };
        }
      }
    }
  };
}
function normalizeConfigResolveAlias(config) {
  if (config.resolve && config.resolve.alias) {
    return;
  }
  if (!config.resolve) {
    config.resolve = { alias: [] };
  } else if (!config.resolve.alias) {
    config.resolve.alias = [];
  }
}
async function getRaw(path2) {
  return fs.promises.readFile(path2, { encoding: "utf-8" });
}
function isCustomBlock(query) {
  return !shared.isEmptyObject(query) && "vue" in query && (query["type"] === "custom" || query["type"] === "i18n" || query["blockType"] === "i18n");
}
function getOptions(filename, isProduction, query, sourceMap, inSourceMap, isGlobal = false, forceStringify = false) {
  const mode = isProduction ? "production" : "development";
  const baseOptions = {
    filename,
    sourceMap,
    inSourceMap,
    forceStringify,
    env: mode,
    onWarn: (msg) => {
      console.warn(`[vite-plugin-vue-i18n]: ${filename} ${msg}`);
    },
    onError: (msg) => {
      console.error(`[vite-plugin-vue-i18n]: ${filename} ${msg}`);
    }
  };
  if (isCustomBlock(query)) {
    return Object.assign(baseOptions, {
      type: "sfc",
      locale: shared.isString(query.locale) ? query.locale : "",
      isGlobal: isGlobal || query.global != null
    });
  } else {
    return Object.assign(baseOptions, {
      type: "plain",
      isGlobal: false
    });
  }
}
async function generateBundleResources(resources, isProduction, forceStringify, isGlobal = false) {
  const codes = [];
  for (const res of resources) {
    debug(`${res} bundle loading ...`);
    if (/\.(json5?|ya?ml)$/.test(res)) {
      const { ext, name } = path__default.parse(res);
      const source = await getRaw(res);
      const generate = /json5?/.test(ext) ? bundleUtils.generateJSON : bundleUtils.generateYAML;
      const parseOptions = getOptions(
        res,
        isProduction,
        {},
        false,
        void 0,
        isGlobal,
        forceStringify
      );
      parseOptions.type = "bare";
      const { code } = generate(source, parseOptions);
      debug("generated code", code);
      codes.push(`${JSON.stringify(name)}: ${code}`);
    }
  }
  return `export default {
  ${codes.join(`,
`)}
}`;
}

module.exports = pluginI18n;
