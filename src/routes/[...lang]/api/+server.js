import { json } from '@sveltejs/kit';

export async function GET({ url }) {
    const response = await fetch('http://localhost:8001/restriction', {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Accept-Language':'de'
      }
    });
    const responseJson = await response.json();   
    return json(responseJson);
  }