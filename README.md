# mo.boilerplate.react-vite

## Create a new repo with the boilerplate content

Follow the following link and fill the form with the name of your new project

https://github.com/mercadona/mo.boilerplate.react-vite/generate

## Setup your local environment
Create a `.env.local` file under `config/env/` directory. You can take this as an starting point:

```dotenv
HOST='localhost'
HTTPS=false
PORT=3000

VITE_APP_ENV='LOCAL'
VITE_APP_WEBSITE_NAME='LOCAL | Boilerplate'
VITE_APP_VERSION=${NODE_IMAGE_VERSION}

VITE_APP_API_HOST='//boilerplate.sta.monline/api'
VITE_APP_API_VERSION = '/v1_0'

# Sentry
VITE_APP_SENTRY_KEY=''
VITE_APP_SENTRY_HOST='sentry.sta.monline'
VITE_APP_SENTRY_PROJECT=''

# Elastic APM
VITE_APP_ELASTIC_APM_NAME='boilerplate_sta'
VITE_APP_ELASTIC_APM_HOST='http://apm.sta.monline'
```

### Troubleshooting

#### Network overlap
Run the following script and follow the instructions printed in the console to remove network collisions

https://github.com/mercadona/mo.tools.devtools/blob/master/docker_network_overlap.sh

## Running locally

### Install
You need `node` and `npm` installed in your system. Please, use [nvm](https://github.com/nvm-sh/nvm) or [asdf](https://asdf-vm.com/) to install the proper Node version.

Install the project dependencies:

```bash
npm install
```

### Start local server

Runs the app in development mode:

```bash
npm start
```

### Run the unit test
Runs the test watcher in an interactive mode:

```bash
npm test
```

Take a look at the available commands under `npm test`

# Deployment

Review the changelog since the last tag

```bash
make changelog
```

Prepare a deployment of the last version

```bash
make prepare-deploy
```
# mo.sre.frontend.auth-spike
# mo.sre.frontend.auth-spike
