import { Plugin } from 'vite';

declare type VitePluginVueI18nOptions = {
    forceStringify?: boolean;
    runtimeOnly?: boolean;
    compositionOnly?: boolean;
    fullInstall?: boolean;
    include?: string | string[];
    defaultSFCLang?: 'json' | 'json5' | 'yml' | 'yaml';
    globalSFCScope?: boolean;
    useVueI18nImportName?: boolean;
};

declare function pluginI18n(options?: VitePluginVueI18nOptions): Plugin;

export { pluginI18n as default };
