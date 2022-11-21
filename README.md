<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repo
2. Ejecutar

```
yarn install
```

3. Instalar CLI instalado

```
npm i -g @nestjs/cli
```

4. Levantar la DB. En este caso es mongo

```
docker-compose -up -d
```

5. Clonar el archivo __.env.template__ y renombrar el archivo a __.env__

6. Llenar las variables definidas en el __.env__

7. Ejecutar la aplicació en DEV

```
yarn start:dev
```

8. Reconstruir la base de datos con la semilla

```
http://localhost:3000/api/v2/seed
```

# Buil de producción

1. Crear el archivo __.env.prod__
2. Llenar las variables de __.env.prod__
3. Construir la imagen de docker

```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

y para ejecutarlo como detached

```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d
```




# Stack usado

* Nest
* Mongo