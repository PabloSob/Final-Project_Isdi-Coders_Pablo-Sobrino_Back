## USER ENDPOINTS

[POST] /users/register -> registrará al usuario y se guardará en la BD
STATUS: 201

[POST] /users/login -> iniciará sesión el usuario y se creará el token
STATUS: 200

## CRYPTOS ENDPOINTS

[GET] /cryptos -> devuelve un array con todos los crypto proyectos de la BD
STATUS: 200

[GET] /cryptos/:id -> devuelve un crypto proyecto detail de la BD por id
STATUS: 200

[POST*] /cryptos/create -> recibe un crypto proyecto (sin id), lo crea en la BD y devuelve el crypto proyecto recién creado
STATUS: 201

[PUT*] /cryptos/modify -> recibe un crypto proyecto, modifica en la BD el crypto proyecto con la misma id que el recibido, y devuelve el crypto proyecto modificado
STATUS: 201

[DELETE*] /cryptos/delete/:id -> elimina de la BD un crypto proyecto por id y devuelve un objeto con la id
STATUS: 201

STATUS ERRORES=

- 400: Bad Request
- 404: Not found
- 409: Conflicts
- 500: Internal Server Error
