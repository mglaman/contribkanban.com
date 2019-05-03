#!/bin/bash

if [[ -z ${1} ]]; then
    echo "Provide a state"
    exit 1
fi
if [[ -z ${LAGOON_GIT_SHA} ]]; then
    echo "Cannot detect LAGOON_GIT_SHA"
    exit 0
fi

if [[ -z ${GITHUB_TOKEN} ]]; then
    echo "No Github token :("
    env
    exit 1
fi

curl https://api.github.com/repos/mglaman/contribkanban.com/statuses/${LAGOON_GIT_SHA} -X POST -H "Content-Type: application/json" -H "Authorization: token ${GITHUB_TOKEN}" --data '{"state": "'${1}'", "target_url": "'${LAGOON_ROUTE}'", "description": "The environment is '${1}'", "context": "amazeeio/lagoon"}'
