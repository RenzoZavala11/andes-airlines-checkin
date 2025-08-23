# API de Check-in Automático de Vuelos

Una API REST construida con Express.js y Sequelize que permite gestionar el check-in automático de pasajeros, con lógica de asignación inteligente de asientos que prioriza menores de edad y grupos familiares.

## Características

- **Check-in automático**: Asignación inteligente de asientos basada en algoritmos de priorización
- **Priorización de menores**: Los menores de 18 años se asignan junto a acompañantes adultos
- **Agrupación familiar**: Los pasajeros de la misma compra se sientan juntos cuando es posible
- **Gestión por tipo de asiento**: Respeta las preferencias de clase (económica, ejecutiva, primera)
- **Base de datos relacional**: Modelos bien estructurados con Sequelize ORM
- **CORS habilitado**: Permite la integración con aplicaciones frontend desde diferentes dominios
- **Documentación interactiva**: Interfaz Swagger UI disponible en la ruta `/docs`

## Prerequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Base de datos compatible con Sequelize (MySQL)

## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/RenzoZavala11/andes-airlines-checkin.git

   cd andes-airlines-checkin
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crear un archivo `.env` en la raíz del proyecto:
   ```env
   DB_HOST=your_host
   DB_PORT=3306
   DB_USER=your_username
   DB_PASS=your_password
   DB_NAME=your_db_name
   ```

4. **Configurar la base de datos**
   - Asegúrate de que tu base de datos esté corriendo
   - Las tablas se van a sincronizar automáticamente al iniciar la aplicación

## Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

La API estará disponible en:
- Desarrollo: `http://localhost:3000`
- Producción: `https://andes-airlines-checkin-production.up.railway.app`

## API Endpoints

### GET /flights/:id/passengers

Obtiene los pasajeros de un vuelo con asignación automática de asientos.

**Parámetros:**
- `id`: ID del vuelo (número entero)

**Respuesta exitosa (200):**
```json
{
  "code": 200,
  "data": {
    "flightId": 1,
    "takeoffDateTime": 1688207580,
    "takeoffAirport": "Aeropuerto Internacional Arturo Merino Benítez, Chile",
    "landingDateTime": 1688221980,
    "landingAirport": "Aeropuerto Internacional Jorge Chávez, Perú",
    "airplaneId": 1,
    "passengers": [
      {
        "passengerId": 90,
        "dni": 983834822,
        "name": "Marisol",
        "age": 44,
        "country": "México",
        "boardingPassId": 24,
        "purchaseId": 47,
        "seatTypeId": 1,
        "seatId": 1
      },
      {...}
    ]
  }
}
```

**Vuelo no encontrado (404):**
```json
{
  "code": 404,
  "data": {}
}
```

**Error de conexión (400):**
```json
{
  "code": 400,
  "errors": "could not connect to db"
}
```

## Algoritmo de Asignación de Asientos

### 1. **Priorización de Grupos**
- **Grupos con menores primero**: Los grupos que incluyen menores de 18 años tienen prioridad
- **Ordenamiento por tamaño**: Los grupos más grandes se procesan primero

### 2. **Asignación para Menores**
- Los menores de edad se asignan junto a un acompañante adulto del mismo grupo de compra
- Se buscan asientos contiguos (lado a lado) para menor + adulto
- Solo se procesan asientos del mismo tipo de clase

### 3. **Asignación para Adultos**
- Los adultos restantes (≥18 años) se asignan a asientos disponibles
- Se respeta el tipo de asiento de su pase de abordar
- Asignación secuencial por disponibilidad

### 4. **Filtros y Restricciones**
- **Respeto por clase**: Solo asientos del `seatTypeId` correspondiente
- **Asientos ocupados**: Se excluyen asientos ya asignados

## Modelo de Datos

### Entidades Principales

- **Flight**: Información del vuelo (horarios, aeropuertos, avión)
- **Passenger**: Datos del pasajero (nombre, edad, país, DNI)
- **Boarding_pass**: Pase de abordar (conexión pasajero-vuelo-asiento)
- **Seat**: Asientos específicos del avión (fila, columna, tipo)
- **Seat_type**: Tipos de asiento (económica, ejecutiva, primera)
- **Purchase**: Compras/reservas (agrupa pasajeros)
- **Airplane**: Información del avión

### Relaciones Clave

```
Flight 1:N Boarding_pass N:1 Passenger
Flight N:1 Airplane 1:N Seat
Boarding_pass N:1 Seat N:1 Seat_type
Boarding_pass N:1 Purchase
```

## Deploy

### Backend (API)

La API está desplegada en [Railway](https://railway.app/), una plataforma moderna de hosting para aplicaciones web:

- **URL Base**: `https://andes-airlines-checkin-production.up.railway.app`
- **Endpoint de ejemplo**: [/flights/1/passengers](https://andes-airlines-checkin-production.up.railway.app/flights/1/passengers)
- **Documentación Swagger**: [/docs](https://andes-airlines-checkin-production.up.railway.app/docs)

### Frontend de la Aplicación

La interfaz de usuario está desplegada en [Netlify](https://www.netlify.com/), una plataforma para hosting de sitios estáticos y aplicaciones web:

- **URL**: [https://andes-airlines-rz.netlify.app/](https://andes-airlines-rz.netlify.app/)

## Documentación de la API

La documentación completa de la API está disponible a través de Swagger UI:

- **Desarrollo**: `http://localhost:3000/docs`
- **Producción**: `https://andes-airlines-checkin-production.up.railway.app/docs`

## Tecnologías Utilizadas

- **Express.js**: Framework web para Node.js
- **Sequelize**: ORM para base de datos relacionales
- **dotenv**: Gestión de variables de entorno
- **mysql2**: Cliente MySQL para Node.js
- **nodemon**: Herramienta para desarrollo que reinicia el servidor automáticamente
- **swagger-jsdoc**: Generador de documentación Swagger a partir de comentarios JSDoc
- **swagger-ui-express**: Cliente Swagger para Express.js
- **cors**: Middleware para habilitar Cross-Origin Resource Sharing (CORS) y permitir peticiones desde otros dominios
