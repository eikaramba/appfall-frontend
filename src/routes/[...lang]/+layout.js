import { redirect } from '@sveltejs/kit';
import { loadTranslations } from '$lib/translations';
import { browser } from '$app/environment';

export async function load({url,data}) {
	const { pathname } = url;
	const lang = `${pathname.match(/[^/]+?(?=\/|$)/) || ''}`;
	const route = pathname.replace(new RegExp(`^/${lang}`), '');
	await loadTranslations(lang, route); //does not work in layout.server.js!
	return {lang,route,...data}
	
}
