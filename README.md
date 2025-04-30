# ElectivaII_TinderClone_AA

**Nombre de la materia:** Electiva II

**Nombre del proyecto:** Clon de Tinder con Node.js y Express

**Equipo:** AA

**Integrantes:** 
* Alejandra Orrego Higuita
* Juan David Alzate Zapata
  
**Descripción:**
Este es un clon de Tinder desarrollado con Node.js, express con mongoose. 

**La aplicación permite a los usuario**
- 🔐 Sistema de autenticación con JWT
- 🛡️ Protección de rutas
- 👤 Creación y actualización de perfil de usuario
- 🖼️ Carga de imágenes para los perfiles
- 🔄 Función de deslizar a la derecha/izquierda
- 💬 Mensajería en tiempo real
- 🔔 Notificaciones en tiempo real
- 🤝 Algoritmo de emparejamiento
- 📱 Diseño responsivo para dispositivos móviles

### Configuración del archivo .env
```bash
PORT=5000
MONGO_URI=<your_mongo_uri>

JWT_SECRET=<your_very_strong_secret>

NODE_ENV=development
CLIENT_URL=http://localhost:5173

CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
```

**Requerimientos**
* Node.js: Para el backend.
* Express: Para manejar las rutas y la lógica del servidor.
* MongoDB: Para el almacenamiento de datos de usuarios y matches.
* Socket.io: Para la funcionalidad de chat en tiempo real.
* React js: Para el Frontend

**Instrucciones de compilación y ejecución:** 
1. Clonar el repositorio https://github.com/Juancho0612/ElectivaII_TinderClone_AA
2. Ejecutar npm i
3. npm run dev
