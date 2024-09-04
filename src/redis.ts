import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

export async function connectToRedis() {
  try {
    await client.connect();
    
  } catch (error) {
    console.log("Redis Client Error", error);
  }
}
// connectToRedis();


