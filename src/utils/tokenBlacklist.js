//Almacena tokens invalidados en un Set (estructura que evita duplicados).

const listaNegraTokens = new Set();

export const addTokenToBlacklist = (token) => {
  listaNegraTokens.add(token);
};

export const isTokenBlacklisted = (token) => {
  return listaNegraTokens.has(token);
};


