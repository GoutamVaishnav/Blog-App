import { Message } from "./../../node_modules/@types/amqplib/properties.d";
import amqp from "amqplib";

let channel: amqp.Channel;
export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: "localhost",
      port: 5672,
      username: "admin",
      password: "admin123",
    });
    channel = await connection.createChannel();
    console.log("❤️  connected to RABBITMQ");
  } catch (error) {
    console.error("❌ Error connecting to RabbitMQ:", error);
  }
};

export const publishToQueue = async (queueName: string, message: any) => {
  if (!channel) {
    console.log("RabbitMQ channel is not initialized.");
    return;
  }
await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)),{
    persistent: true
  });
  console.log(`✅ Message sent to queue ${queueName}:`, message);
};


export const invalidareCacheJob = async (cacheKeys: string[]) => {
  try {
    const message ={
      action : "INVALIDATE_CACHE",
      keys : cacheKeys
    }
    await publishToQueue("cache-invalidation", message);
    console.log("Cache invalidation is send to the RabbitMQ");
    
  } catch (error) {
     console.error("❌Failed to send message to RabbitMQ:", error);
  }
};
