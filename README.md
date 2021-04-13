# Shopstore Node App

## Run App

### Before run

This server app has two roles: `QUEUE` and `REST`. Defined in `SERVICE_ROLE` environment variable. With `REST` role the app will receive API requests. And with `QUEUE` role the app will consume messages of a running Redis instance.

Leave the environment variable unset to run an unique instance with both roles.

The [.env file](.env) was committed with environment variables for PostgreSQL database as a service, Mailtrap SMTP server and Redis running locally. But you have to set SMTP server to view e-mail verification codes.

So, before run set the following entries in .env file...

SMTP server:

- `MAIL_HOST`
- `MAIL_PORT`
- `MAIL_USER`
- `MAIL_PW`

If not set, instances with roles `REST` will crash at start.

Redis server:

- `REDIS_HOST`
- `REDIS_PORT`

If not set, instances with roles `QUEUE` will crash at start.

### Running

Just get into the project's folder using a terminal and type the commands below:

```
npm install
npm run dev
```

A [Postman collection file](Shopstore%20API.postman_collection.json) is included to help API testing.

If you want to use your own PostgreSQL, please set the connection values (host, port, database name, user and password) in [.env file](.env) and also in [Sequelize config file](config/config.json).

Make sure that [sequelize-cli]() is installed and execute in terminal inside project's folder:

```sh
sequelize db:migrate
```

If everything is fine you will see the following output:

```sh
Sequelize CLI [Node: 12.18.1, CLI: 6.2.0, ORM: 6.6.2]

Loaded configuration file "config\config.json".
Using environment "development".
== 20210408000122-create-product: migrating =======
== 20210408000122-create-product: migrated (0.701s)

== 20210409163050-create-user: migrating =======
== 20210409163050-create-user: migrated (0.692s)

== 20210411211610-create-product-image: migrating =======
== 20210411211610-create-product-image: migrated (0.717s)
```

## API

The following sections describe all REST APIs contracts.

### User services

#### Signup

> Endpoint: `POST /signup`

> Metric label: user_signup

Create an user account and returns authorization token.

**Request body**:

| Field   | Data type  | Mandatory
| ------- | ---------- | :-------:
| name    | string     | yes
| email   | string     | yes
| password| string     | yes

**Response body**:

| Field             | Data type  |
| ----------------- | ---------- |
| id                | number     |
| name              | string     |
| email             | string     |
| password          | string     |
| token             | string     |
| verification_code | string     |
- `| email_verified    | boolean    |`
| registered_at     | Date       |
| updated_at        | Date       |
| token             | string     |

#### Signin

> Endpoint: `POST /signin`

> Metric label: user_signin

Receives user credential, already registered, and returns authorization code.

**Request body**:

| Field   | Data type  | Mandatory
| ------- | ---------- | :-------:
| email   | string     | yes
| password| string     | yes

**Response body**:

| Field             | Data type  |
| ----------------- | ---------- |
| id                | number     |
| name              | string     |
| email             | string     |
| password          | string     |
| token             | string     |
| verification_code | string     |
- `| email_verified    | boolean    |`
| registered_at     | Date       |
| updated_at        | Date       |
| token             | string     |

Verify user credential, email and passord, and returns authorization code.

### Confirm code

> Endpoint: `POST /users/confirm`

> Metric label: user_confirm_code

Receives e-mail confirmation code and validate it.

**Request body**:

| Field   | Data type  | Mandatory
| ------- | ---------- | :-------:
| id      | number     | yes
| code    | string     | yes

**Response body**:

| Field             | Data type  |
| ----------------- | ---------- |
| id                | number     |
| name              | string     |
| email             | string     |
| password          | string     |
| token             | string     |
| verification_code | string     |
- `| email_verified    | boolean    |`
| registered_at     | Date       |
| updated_at        | Date       |
| token             | string     |

## Product services

**Important:** the user authorization token is necessary to execute all product services.

### Create

> Endpoint: `POST /products`

> Metric label: product_create

**Request body**:

| Field        | Data type  | Mandatory
| ------------ | ---------- | :-------:
| name         | string     | yes
| description  | string     | no
| price        | number     | yes
| active       | boolean    | no (1)
| base64images | string[]   | no (2)

1) Setted to `true` if `active` is absent.
2) Array of strings with images encoded to base64.

**Response body**:

| Field             | Data type  |
| ----------------- | ---------- |
| id                | number     |
| name              | string     |
| price             | number     |
| description       | string     |
| active            | boolean    |
| published_at      | Date (1)   |
| updated_at        | Date       |
| images            | object[] (2) |
| images.id         | number     |
| images.product_id | number     |
| images.image_name | string     |
| images.created_at | Date       |
| images.updated_at | Date       |

1) Use current date and time.
2) List of images saved.

### Update

> Endpoint: `PUT /products/:id`

> Metric label: product_update

**Request parameter**:

| Parameter | Data type  | Mandatory
| --------- | ---------- | :-------:
| id        | number     | yes

**Request body**:

| Field          | Data type  | Mandatory
| -------------- | ---------- | :-------:
| name           | string     | yes
| description    | string     | no
| price          | number     | yes
| active         | boolean    | no
| base64images   | string[]   | no (1)
| removedImageIds| string[]   | no (2)

1) List of new images added to product.
2) List of ids of old images to remove.

**Response body**:

| Field             | Data type  |
| ----------------- | ---------- |
| id                | number     |
| name              | string     |
| description       | string     |
| price             | number     |
| active            | boolean    |
| published_at      | Date       |
| updated_at        | Date       |
| images            | object[]   |
| images.id         | number     |
| images.product_id | number     |
| images.image_name | string     |
| images.created_at | Date       |
| images.updated_at | Date       |

### Get

> Endpoint: `GET /products`

> Metric label: product_get

**Request body**:

N/A

**Response body**:

A array of product objects:

| Field         | Data type  |
| ------------- | ---------- |
| id            | number     |
| name          | string     |
| description   | string     |
| price         | number     |
| active        | boolean    |
| published_at  | Date       |
| updated_at    | Date       |

### Get product image

> Endpoint: `GET /products/:id/images`

> Metric label: product_get_images

**Request parameter**:

| Parameter     | Data type  |
| ------------- | ---------- |
| id            | number     |

**Request body**:

N/A

**Response body**:

An array of produt images objects:

| Field      | Data type  |
| ---------- | ---------- |
| id         | number     |
| product_id | number     |
| image_name | string     |
| created_at | Date       |
| updated_at | Date       |

## Metrics

> Endpoint: `GET /metrics`

All controllers' methods have Prometheus metrics to measure the process duration.

So it's possible to use Grafana or any similar application to consume metrics and build monitoring dashboards.

### Implemented metrics

`service_request_duration_seconds_bucket`: measure of business process time aggregated by [*metric label*](https://prometheus.io/docs/practices/naming/#labels) `action`. Also includes label `error` in case of failure.

`job_fail_counter`: count queue job's failure.
