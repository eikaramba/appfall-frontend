import i18n from 'sveltekit-i18n';
import lang from './lang.json';

/** @type {import('sveltekit-i18n').Config} */


const config = {
  translations: {
    en: { lang },
    de: { lang },
  },
  loaders: [
{
  locale: 'de',
  key: '',
  loader: async () => (  await import('./de/index.json')).default,
},
{
  locale: 'en',
  key: '',
  loader: async () => (  await import('./en/index.json')).default,
}
  ]};


export const defaultLocale = 'de';

export const { t, locale, locales, loading, loadTranslations, translations } = new i18n(config);

// Translations logs
loading.subscribe(async ($loading) => {
  if ($loading) {
    await loading.toPromise();
  }
});