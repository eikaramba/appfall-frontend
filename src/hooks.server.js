import {dev} from '$app/environment';

import { defaultLocale, locales,locale } from '$lib/translations';

const routeRegex = new RegExp(/^\/([^.]*|.*\.json)+([?#].*)?$/);

export const handle = async ({ event, resolve }) => {

  const { url, request } = event;
  const { pathname } = url;

  let transformPageChunk;

  // If this request is a route request
  // if (routeRegex.test(pathname)) {
    // Get defined locales
    const supportedLocales = locales.get();

    // Try to get locale from `pathname`.
    let localeFromPath = supportedLocales.find((l) => `${l}`.toLowerCase() === `${pathname.match(/[^/]+?(?=\/|$)/)}`.toLowerCase());

    // If route locale is not supported
    if (!localeFromPath) {
      // Get user preferred locale
      localeFromPath = `${`${request.headers.get('accept-language')}`.match(/[a-zA-Z]+?(?=-|_|,|;)/)}`.toLowerCase();

      // Set default locale if user preferred locale does not match
      if (!supportedLocales.includes(localeFromPath)) localeFromPath = defaultLocale;

      // 301 redirect
      return new Response(undefined, { headers: {'location': `/${localeFromPath}${pathname}` }, status: 301 });
    }
    if(localeFromPath!=locale.get()) locale.set(localeFromPath)

    // Add html `lang` attribute
      transformPageChunk = ({ html }) => html.replace(/<html lang=\"(.){2}\"/, `<html lang="${localeFromPath}"`);
  // }

  let response = await resolve(event, {
    ...(transformPageChunk?{transformPageChunk}:{})
	});

  return response;
};