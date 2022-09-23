import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday.js'
import isYesterday from 'dayjs/plugin/isYesterday.js'
import utc  from "dayjs/plugin/utc.js";
import { get } from 'svelte/store';
import { page } from '$app/stores';
import { t,locale,locales } from '$lib/translations';
dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.extend(utc)
import { derived } from 'svelte/store';

//https://stackoverflow.com/a/70621458/2644039
//('/users/[user]', {user: 123, tab: 'settings'})) => "/users/123?tab=settings"

function url2(path,params,pageobj) {
  
    // Relative path (starts with `./` or `../`)
  if (path.match(/^\.\.?\//)) {
    if(!pageobj){
      pageobj = get(page);
    }
    let [, breadcrumbs, relativePath] = path.match(/^([\.\/]+)(.*)/);
    let dir = pageobj.url.pathname.replace(/\/$/, '');
    const traverse = breadcrumbs.match(/\.\.\//g) || [];
    // if this is a page, we want to traverse one step back to its folder
    traverse.forEach(() => (dir = dir.replace(/\/[^\/]+\/?$/, '')));
    path = `${dir}/${relativePath}`.replace(/\/$/, '');
    path = path || '/'; // empty means root
  }
  let finalPath=path;

  if(params){
    const query = { ...params };
    for (let param in query) {
      if (query[param] === undefined /* In case of undefined assignment */
        || query[param] === null 
        || query[param] === ""
      ) {    
        delete query[param];
      }
    }
    for (const [param, value] of Object.entries(params)) {
        const replaced = path.replace(`[${param}]`, value);
        if (replaced !== path) {
          path = replaced;
          delete query[param];
        }
    }
    const search = new URLSearchParams(query).toString();
    finalPath =  `${path}${search ? `?${search}` : ""}`;
  }

  // Get defined locales
  const supportedLocales = locales.get();

  // Try to get locale from `pathname`.
  let localeFromPath = supportedLocales.find((l) => `${l}`.toLowerCase() === `${finalPath.match(/[^/]+?(?=\/|$)/)}`.toLowerCase());

  if(!localeFromPath){
    return "/"+get(locale)+finalPath;
  }else{
    return finalPath;
  }
}
const url = derived(locale, () => (path,params,pageobj)=>url2(path,params,pageobj));


function formatNiceTime(obj){
    if(!obj) return '-';
    const date = dayjs(obj).utc(true).local(); //All datetime entries from directus are in UTC Format, thus converting it here to the local format.
    if(date.year() < dayjs().year()){
      return date.format('DD.MM.YY HH:mm')
    }else{
      if(date.isToday()){
        return `${t.get('console.date.today')} ${date.format('HH:mm')}`
      }else if(date.isYesterday()){
        return `${t.get('console.date.yesterday')} ${date.format('HH:mm')}`
      }else{
        return date.format('DD.MM HH:mm')
      }
    }
  }
  function validateUrl(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
  }
  function IsJsonString(str) {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
  }
  function checkEmail(emailAddress) {
    var sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]';
    var sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]';
    var sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+';
    var sQuotedPair = '\\x5c[\\x00-\\x7f]';
    var sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d';
    var sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22';
    var sDomain_ref = sAtom;
    var sSubDomain = '(' + sDomain_ref + '|' + sDomainLiteral + ')';
    var sWord = '(' + sAtom + '|' + sQuotedString + ')';
    var sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*';
    var sLocalPart = sWord + '(\\x2e' + sWord + ')*';
    var sAddrSpec = sLocalPart + '\\x40' + sDomain; // complete RFC822 email address spec
    var sValidEmail = '^' + sAddrSpec + '$'; // as whole string
  
    var reValidEmail = new RegExp(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i);
  
    return reValidEmail.test(emailAddress);
  }
  function omitNull(obj) {
    Object.keys(obj).filter(k => obj[k] === null).forEach(k => delete(obj[k]))
    return obj
  }


function restrictFields(obj, fields) {
  obj = Object.keys(obj).filter(k => !fields.includes(k)).forEach(k => delete(obj[k]))
}

function getBodyParam(name,body) {
  if(typeof body.get == 'function'){
    return body.get(name)
  }else{
    return body[name];
  }
}

function stringInArray(string, array) {
  return array.some(item => string.toLowerCase().includes(item.toLowerCase()));
}

export {formatNiceTime,url,checkEmail,IsJsonString,validateUrl,omitNull,restrictFields,getBodyParam,stringInArray}