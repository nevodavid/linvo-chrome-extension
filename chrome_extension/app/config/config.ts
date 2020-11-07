interface Params {
    control_panel_url: string;
    api_url: string;
    env: string;
}

interface Env {
    development: Params,
    production: Params
}

const params: Env = {
  development: {
    env: 'development',
    control_panel_url: 'http://localhost:3000',
    api_url: 'http://localhost:3001',
  },
  production: {
    env: 'production',
    control_panel_url: 'https://dashboard.linvo.io',
    api_url: 'https://api-new.linvo.io',
  }
};

export const config = params[process.env.NODE_ENV as 'development' | 'production' || 'development'];
