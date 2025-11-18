import amqp from "amqplib";
import { redisClient } from "../server.js";
import { sql } from "./db.js";

interface CacheInvalidationMessage {
  action: string;
  keys: string[];
}

export const startCacheConsumner = async () => {
    try {
         const connection = await amqp.connect({
      protocol: "amqp",
      hostname: "localhost",
      port: 5672,
      username: "admin",
      password: "admin123",
    });
    const channel = await connection.createChannel();
    const queueName = "cache-invalidation";
    await channel.assertQueue(queueName, { durable: true });
    console.log("blog service cache consumer is started");
    channel.consume(
        queueName,
        async (msg) => {
            try {
                const content = JSON.parse(msg!.content.toString()) as CacheInvalidationMessage;
                console.log("💬 Blog service received the cache invalidation msg", content);

                if(content.action === "INVALIDATE_CACHE"){
                    for(const pattern of content.keys){
                       const keys = await redisClient.keys(pattern);
                       if(keys.length > 0){
                        await redisClient.del(keys);
                        console.log(`🗑️ Blog service invalidate ${keys.length} cache keys matching :${pattern}`);

                          
                        const category=""
                        const searchQuery=""
                        const cacheKey = `blogs:${searchQuery}:${category}`;
                        const blogs= await sql`SELECT * FROM blogs ORDER BY create_at DESC`;
                        await redisClient.set(cacheKey, JSON.stringify(blogs), { EX: 3600 }); // Cache for 1 hour
                        console.log(`🔄 Cache rebuild with key :${cacheKey}`);
                       }
                    }
                }
                channel.ack(msg!);

            } catch (error) {
                console.log("❌ Error processing cache invalidation in blog service :", error)
                channel.nack(msg!, false, true);
            }
        }
    );
    } catch (error) {
        console.log("❌ Failed to start RabbitMQ in blod service", error)
    }
}