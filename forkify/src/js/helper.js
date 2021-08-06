import { API_TIMOUT_SEC } from './config';

// função utilizada para determinar um timout para a requisição AJAX
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    // se passar o tempo de respota a promise é rejeitada
    const response = await Promise.race([fetch(url), timeout(API_TIMOUT_SEC)]);
    const json = await response.json();
    if (!response.ok) throw new Error(json.message);
    return json.data;
  } catch (erro) {
    throw erro;
  }
};

export const sendJSON = async function (url, data) {
  try {
    // se passar o tempo de respota a promise é rejeitada
    const response = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),
      timeout(API_TIMOUT_SEC),
    ]);
    const json = await response.json();
    if (!response.ok) throw new Error(json.message);
    return json.data;
  } catch (erro) {
    throw erro;
  }
};

// REFATORAÇÃO PARA AS FUNÇÕES DE GET E SEND JSON
/*
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
*/
