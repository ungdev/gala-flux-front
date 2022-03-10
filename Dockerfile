FROM node:7

ENV NODE_ENV=production

ARG API_URI=http://localhost:1337
ENV REACT_APP_API_URI $API_URI

ARG API_TIMEOUT=5000
ENV REACT_APP_API_TIMEOUT $API_TIMEOUT

WORKDIR /srv/app

RUN chown node:node .

USER node

# Node has the uid 1000
COPY --chown=node:node package.json yarn.lock ./

RUN yarn --frozen-lockfile --production=false

COPY --chown=node:node ./ ./

# Build api
RUN yarn build

# Prunes devDependencies
RUN yarn install --production --ignore-scripts --prefer-offline

CMD yarn start