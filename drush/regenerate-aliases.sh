#!/bin/bash
rm drush/sites/lagoon.site.yml
docker-compose exec cli drush site:alias-convert /app/drush/sites --yes
