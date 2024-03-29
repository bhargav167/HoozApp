// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
 api_url: 'https://redx.in/api/',
 // api_url: 'http://localhost:5000/api/',
  hubConnectionURL: 'http://localhost:5000/signalr',
  broadcastURL: 'http://localhost:5000/api/Chat/send',
  broadcastJobURL: 'http://localhost:5000/api/Chat/Jobsend'
};
