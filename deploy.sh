#!/bin/bash
DOKKU_HOST=ung.utt.fr
DOKKU_PROD=flux.uttnetgroup.fr
DOKKU_DEV=flux-dev.uttnetgroup.fr

if [[ -n $SSH_DEPLOY_KEY ]] ; then
    # Set up ssh key
    mkdir -p ~/.ssh
    echo -e "${SSH_DEPLOY_KEY}" > ~/.ssh/id_rsa
    chmod 600 ~/.ssh/id_rsa
    eval $(ssh-agent -s)
    ssh-add ~/.ssh/id_rsa
    # SSH config
    echo -e "Host *\n\tStrictHostKeyChecking no\n\n" > ~/.ssh/config
    # Add dokku to known hosts
    ssh-keyscan -H $DOKKU_HOST >> ~/.ssh/known_hosts
    # Add commit with git original repo informations
    mkdir deploy
    mv dist deploy/
    mv static.json deploy/
    cd deploy
    git init
    git add . -A
    git config user.name "Travis"
    git config user.email "ung@utt.fr"
    git commit -m "Deploy"
    # Deploy
    if [[ $TRAVIS_BRANCH == 'master' ]] ; then
        git remote add dokku dokku@$DOKKU_HOST:$DOKKU_PROD
    else
        git remote add dokku dokku@$DOKKU_HOST:$DOKKU_DEV
    fi
    git push dokku HEAD:refs/heads/master -f
fi
