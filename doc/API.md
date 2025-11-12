# Documentación de la API — Proyecto ISFT151-PP3

Fecha: 7 de noviembre de 2025

Esta documentación describe los endpoints expuestos por la API del proyecto. Está pensada como referencia rápida para desarrolladores front-end/back-end.

Host (por defecto de desarrollo)
- http://localhost:3000

Convenciones generales
- Formato de intercambio: JSON
- Cabecera común de petición de tipo JSON: `Content-Type: application/json`
- Autenticación: JWT en cabecera `Authorization: Bearer <token>` (donde aplica)

Formato de error común (ejemplo)
```json
{
  "type": "error",
  "description": "User not found"
}
```

---

## Endpoints

NOTA: Tomé como referencia el endpoint `/IUserService/GetAllUsers` que enviaste; en este proyecto ese endpoint equivale a `GET /users`.

### 1) Get all users — (Referencia: /IUserService/GetAllUsers)
- Endpoint: `GET /users`
- Método HTTP: GET
- Cabecera entrada: -
- Cabecera salida: `Content-Type: application/json`
- Estructura input: {}
- Estructura output: array de objetos usuario

Ejemplo (respuesta):
```json
[
  {
    "id": 2,
    "name": "example",
    "email": "example@example.com"
  }
]
```

Errores:
- 500 Internal Server Error — cuando ocurre un error en el servidor (se devuelve estructura de error común).

Código de estado:
- 200 OK — cuando la lista se obtiene correctamente.

---

### 2) Get user by id
- Endpoint: `GET /users/:id`
- Método: GET
- Input: ninguno en cuerpo. `:id` en path.
- Output: objeto usuario (200) o 404 si no existe.

Ejemplo (respuesta 200):
```json
{
  "id": 1,
  "name": "Marcos",
  "username": "marcos80",
  "email": "marcos@example.com"
}
```

Errores:
- 404 Not Found — usuario no encontrado
- 500 Internal Server Error

---

### 3) Crear usuario
- Endpoint: `POST /users`
- Método: POST
- Cabeceras: `Content-Type: application/json`
- Input (body):
```json
{
  "name": "Nombre",
  "username": "usuario",
  "email": "correo@ejemplo.com",
  "password": "secreto"
}
```
- Output (201):
```json
{
  "message": "Usuario registrado exitosamente",
  "id": 123
}
```

Errores:
- 500 Internal Server Error — en caso de fallo al insertar.

---

### 4) Seguir una mascota (like)
- Endpoint: `POST /users/:id_user/follow/:id_pet`
- Método: POST
- Descripción: marca que el usuario `id_user` sigue (da like) a la mascota `id_pet`. Inserta una fila en `user_pet_follow`.
- Input: ninguno en body (los parámetros están en la URL)
- Output (201):
```json
{
  "message": "El usuario 5 ahora sigue a la mascota 12",
  "result": { /* resultado del insert */ }
}
```

Errores:
- 500 Internal Server Error — error en la operación de seguimiento.

Nota: dar like no creaba previamente una conversación; en el frontend se agregó una llamada a `/chat/start/:user/:pet` para crear/recuperar la conversación automáticamente si se desea.

---

### 5) Listar todas las mascotas
- Endpoint: `GET /pets`
- Método: GET
- Output: array con objetos mascota (todos los campos de la tabla `pet`).

Ejemplo:
```json
[
  {
    "id": 12,
    "id_owner": 5,
    "name": "Fido",
    "age": 3,
    "description": "Perro amigable",
    "image": "/uploads/abc.jpg"
  }
]
```

---

### 6) Crear mascota
- Endpoint: `POST /pet`
- Método: POST
- Cabeceras: `Content-Type: application/json`
- Input (body):
```json
{
  "id_owner": 5,
  "name": "Fido",
  "age": 3,
  "description": "Perro"
}
```
- Output (201/200 según implementación): respuesta con objeto `result` que incluye `insertId`.

Errores comunes:
- 400 Bad Request — si faltan campos (recomendación: validar en backend)
- 500 Internal Server Error — error de base de datos

Observación importante: el backend debe recibir `req.body` correctamente. Para esto `express.json()` debe estar registrado antes de montar las rutas (ya se corrigió en app.js si correspondía).

---

### 7) Borrar (marcar) mascota
- Endpoint: `PUT /pet`
- Método: PUT (en esta implementación se usa PUT para borrar pasando `{ id }` en el body)
- Input (body):
```json
{ "id": 12 }
```
- Output: objeto con mensaje de borrado o resultado.

---

### 8) Buscar mascota por username (dueño)
- Endpoint: `GET /pet/:username`
- Método: GET
- Output: lista de mascotas del usuario `username`.

---

### 9) Subir foto de mascota
- Endpoint: `POST /pet/:id/photo`
- Método: POST
- Cabeceras: `Content-Type: multipart/form-data`
- Input: form-data con key `photo` (archivo)
- Output: `{ "message": "Foto guardada correctamente", "photoUrl": "/uploads/archivo.jpg" }`

---

### 10) Chats — endpoints principales

- `GET /chat/list/:id_user` — Lista mascotas seguidas y sus dueños (útil para mostrar posibles chats a iniciar)

- `POST /chat/start/:id_user/:id_pet` — Buscar o crear conversación entre `id_user` y el dueño de `id_pet`. Respuesta de ejemplo:
```json
{
  "message": "Conversación lista",
  "conversationId": 7,
  "owner": "dueño_de_mascota",
  "petName": "Fido"
}
```

- `POST /chat/:id_conversation/message` — Enviar mensaje a conversación
  - Body: `{ "id_sender": 5, "content": "Hola" }`
  - Respuesta: `{ "message": "Mensaje enviado", "id": 123 }`

- `GET /chat/:id_conversation/messages` — Obtener mensajes de una conversación (orden ascendente por created_at)

- `GET /chat/conversations/:id_user` — Listar conversaciones activas donde participa `id_user`. Respuesta ejemplo:
```json
[
  {
    "conversation_id": 7,
    "id_pet": 12,
    "pet_name": "Fido",
    "user1_name": "alice",
    "user2_name": "bob",
    "created_at": "2025-11-07T10:00:00Z"
  }
]
```

---

## Ejemplos de uso (fetch desde frontend)

Obtener todos los usuarios:
```javascript
const res = await fetch('http://localhost:3000/users');
if (!res.ok) throw new Error(await res.text());
const users = await res.json();
```

Seguir una mascota (like):
```javascript
await fetch(`/users/${id_user}/follow/${id_pet}`, { method: 'POST' });
```

Iniciar conversación tras un like:
```javascript
await fetch(`/chat/start/${id_user}/${id_pet}`, { method: 'POST' });
```

Subir foto (ejemplo con fetch + FormData):
```javascript
const form = new FormData();
form.append('photo', fileInput.files[0]);
await fetch(`/pet/${petId}/photo`, { method: 'POST', body: form });
```

---

## Recomendaciones y notas finales
- Normalizar las respuestas de error (usar consistentemente la estructura `{ "type": "error", "description": "..." }`).
- Validar inputs en endpoints que crean o modifican recursos (ej. `POST /pet`).
- Proteger con middleware las rutas que lo requieran (si se espera autenticación para crear mascotas, seguir o iniciar chats).
- Considerar devolver códigos HTTP semánticos (201 para creaciones, 400 para peticiones malformadas, 404 para no encontrado, 500 para errores del servidor).

Si querés, puedo:
- generar este documento en otro formato (OpenAPI/Swagger JSON o YAML),
- o crear una versión interactiva (archivo `swagger.json`) para importarlo en Swagger UI.

Fin de la documentación.
