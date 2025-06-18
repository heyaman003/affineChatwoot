use this if you facing issue in running 

1. 
``` bash 
docker compose up -d chatwoot_postgres
 ```
2. 
``` bash 
docker compose up -d chatwoot_redis
 ```

3.
```bash
docker compose run --rm chatwoot_rails bundle exec rails db:chatwoot_prepare
```

this will run and prepare the database

now finally run 

```bash
docker compose up -d
```

