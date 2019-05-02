#!/bin/bash

if [[ -z ${1} ]]; then 
    echo "Provide a state"
    exit 1
fi
if [[ -z ${LAGOON_GIT_SHA} ]]; then
    echo "Cannot detect LAGOON_GIT_SHA"
    exit 0
fi

curl -X POST -H "Content-Type: application/json" \ 
    -H "Authorization: token ${GITHUB_TOKEN}" \
    --data {
        "state": "${1}",
        "target_url": "https://ui-lagoon-master.ch.amazee.io/deployments?name=${LAGOON_SAFE_PROJECT}",
        "description": "The environment is ${1}",
        "context": "amazeeio/lagoon"
    } \
    https://api.github.com/repos/mglaman/contribkanban.com/statuses/${LAGOON_GIT_SHA}