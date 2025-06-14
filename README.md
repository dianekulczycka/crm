# CRM Application

## Project Structure
crm/
├── backend/
│ ├── .env
│ ├── pom.xml
│ ├── src/
│ │ ├── main/
│ │ │ ├── java/
│ │ │ │ └── org/example/crmdemo/
│ │ │ │ ├── configs/
│ │ │ │ ├── controllers/
│ │ │ │ ├── dto/
│ │ │ │ ├── entities/
│ │ │ │ ├── enums/
│ │ │ │ ├── mappers/
│ │ │ │ ├── repositories/
│ │ │ │ ├── security/
│ │ │ │ │ └── filter/
│ │ │ │ ├── services/
│ │ │ │ ├── utilities/
│ │ │ │ └── CrMdemoApplication.java
│ │ │ └── resources/
│ │ └── test/
│ └── target/
└── frontend/
├── node_modules/
├── public/
├── src/
│ ├── components/
│ ├── interfaces/
│ ├── layouts/
│ ├── pages/
│ ├── router/
│ ├── services/
│ ├── index.css
│ ├── index.tsx
│ └── react-app-env.d.ts
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json

## Used stack:

### Back:
- Java 17 + SpringBoot 3
- Spring Web, JPA, Security, Validation
- MySQL, Liquibase
- Springdoc OpenAPI
- JWT
 
### Front:
- React + Typescript, react-router-dom, react-hook-form, react-paginate
- API calls - axios 
- Styling - react-bootstrap
- Handling JWTs - jwt-decode
- Other 3rd party libraries - day.js, file-saver, use-debounce

## API docs: 
- Swagger: [http://localhost:8080/swagger-ui.html]
- Open API json: [http://localhost:8080/v3/api-docs]

## Postman collection: `./CRM.postman_collection.json`

## How to Run (WINDOWS)
Before running, please terminate operations on:
- `localhost:8080` (backend)
- `localhost:3000` (frontend)

You may use `kill-port` for this:

`npm install kill-port`/n
`kill-port 3000 8080`/n

### Back:
- required: Java 17 (verify with `java -version`), Maven (verify with `mvn -v`), MySQL
- from project root, use commands: 

`cd backend`/n
`./mvnw clean install`/n
`./mvnw spring-boot:runv`/n

- via intellij: shift + F10

It will run app on localhost port 8080 `localhost:8080`

### Front:
- required: Node js v16+, npm (verify with `nodejs -v`)
- from project root, use commands: 

`cd frontend`/n
`npm install`/n
`npm start`/n

It will run front end on localhost port 3000 `localhost:3000`
