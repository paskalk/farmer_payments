# farmer_payments

## Backend

```
docker build -t backend .

docker container run -it --rm -p 8000:8000 backend

```

## Frontend

```
docker build -t frontend .

//Dev 
docker container run -it -p 3003:3000 -v /$(pwd):/app frontend

```