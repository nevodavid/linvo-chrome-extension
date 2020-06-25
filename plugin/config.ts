interface Params {
    apiUrl: string
}

interface Env {
    development: Params,
    production: Params
}

const params: Env = {
  development: {
    apiUrl: 'http://localhost:4000'
  },
  production: {
    apiUrl: 'https://api.linvo.io'
  }
};

export const config = params[process.env.NODE_ENV as 'development' | 'production' || 'development'];