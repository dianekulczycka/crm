CRM application

Structure: 
crm/
├── backend/
│   ├── .env
│   ├── pom.xml
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── org/example/crmdemo/
│   │   │   │       ├── configs/
│   │   │   │       ├── controllers/
│   │   │   │       ├── dto/
│   │   │   │       ├── entities/
│   │   │   │       ├── enums/
│   │   │   │       ├── mappers/
│   │   │   │       ├── repositories/
│   │   │   │       ├── security/
│   │   │   │       │   └── filter/
│   │   │   │       ├── services/
│   │   │   │       ├── utilities/
│   │   │   │       └── CrMdemoApplication.java
│   │   │   └── resources/
│   │   └── test/
│   └── target/
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── interfaces/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── router/
│   │   ├── services/
│   │   ├── index.css
│   │   ├── index.tsx
│   │   └── react-app-env.d.ts
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── tsconfig.json
├── README.md
└── CRM.postman_collection	

Used stack:
Back:
- Java 17 + SpringBoot 3
- Spring Web, JPA, Security, Validation
- MySQL, Liquibase
- Springdoc OpenAPI
- JWT
Front:
- React + Typescript, React router, React hook form, React paginate
- Axios for API calls
- Bootstrap 5 - styling
- Day.js, file-saver, use-debounce - 3rd party libraries

API docs: 
- Swagger: http://localhost:8080/swagger-ui.html
- Open API json: http://localhost:8080/v3/api-docs

Postman collection: ./CRM.postman_collection.json

How to run:
! before running, please terminate operations on localhost:8080 and localhost:3000
for this you may use kill-port library:
npm install kill-port
kill-port 3000 8080

Back:
- required: Java 17, Maven, MySQL
- from project root, use commands: 
cd backend 
./mvnw spring-boot:run

- via intellij: shift + F10

It will run app on localhost port 8080 (http://localhost:8080)

Front:
- required: Node js, npm (v 16 or higher)
- from project root, use commands: 
cd frontend
npm install
npm start

It will run front end on localhost port 3000 (http://localhost:3000)
