import Fastify from "fastify";
import AutoLoad from "@fastify/autoload";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mqtt from "mqtt";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = Fastify({
  logger: true,
});

app.register(AutoLoad, {
  dir: join(__dirname, "routes"),
});

async function start() {
  try {
    await app.listen({ port: 3000 });
    const io = new Server(app.server);
    io.on("connection", (socket) => {
      console.log("Usuario Conectado");
    });

    const mqttClient = mqtt.connect("mqtt://localhost:1883");
    
mqttClient.on("connect", () => {
      console.log("🔗 Conectado al broker MQTT en localhost:1883");
      
      const topicToUse = "123987/t";

      // 3. Suscribirse al tema
      mqttClient.subscribe(topicToUse, (err) => {
        if (!err) {
          console.log(`✅ Suscrito exitosamente al tema: ${topicToUse}`);
          
          // 4. Publicar el mensaje de prueba.
          // Usamos 'mqttClient' (la variable correcta) para publicar.
          mqttClient.publish(topicToUse, "¡Hola MQTT desde Node.js!", { qos: 1 });
          console.log(`📤 Mensaje Publicado en el tema: ${topicToUse}`);

        } else {
          console.error("❌ Error al suscribirse:", err);
        }
      });
    });
  
    mqttClient.on("message",(topic,message) => {
      console.log("Mensaje recibido:", topic + message.toString());
    })

  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
