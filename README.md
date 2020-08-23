# Abstract
My Express.js boilerplate constructed based on Jonathan Wexler's [Get Programming with Node.js](https://www.manning.com/books/get-programming-with-node-js?query=node.js).<br>

Used MariaDB instead of MongoDB.

## Structure
```
├── app
│   ├── auth
│   ├── bin
│   ├── controllers
│   ├── node_modules
│   ├── public
│   ├── routes
│   ├── services
│   ├── utils
│   ├── views
│   ├── .env
│   ├── app.js
│   ├── package.json
│   └── yarn.lock
├── docker
│   ├── app
│   │   └── Dockerfile
│   ├── db_subscriber
│   │   ├── sql
│   │   │   ├── init.sql
│   │   │   └── initial_data_*.csv
│   │   ├── var
│   │   └── my.cnf
│   └── web
│       ├── default.conf
│       └── Dockerfile
├── node_modules
├── clear_database.sh
├── create_project.sh
├── docker-compose.yml
├── package.json
├── README.md
└── yarn.lock
```

## Reference
1. [express.js](https://qiita.com/ryo-ohnishi/items/3653f7583c8591eef333)
1. [mariadb](https://qiita.com/A-Kira/items/f401aea261693c395966)
1. [get-programming-with-nodejs](https://github.com/JonathanWexler/get-programming-with-nodejs)
