import redis from "redis";

let client;

export const redisHandler = () => {
  if (!client) {
    client = redis.createClient({
      url: process.env.REDIS_URL,
    });
  }

  const connect = async () => {
    if (!client.isOpen) {
      await client.connect();
    }
    client.on("connect", () => {
      console.log("redis connected!");
    });
    client.on("error", (err) => {
      console.log(err);
    });
  };

  const setValue = async (key, value) => {
    try {
      await connect(); // Reconnect if necessary
      const uniqueKey = `${key}:${Date.now()}}`;
      await client.set(uniqueKey, value, {
        EX: process.env.TOKEN_EXPIRE_TIME,
      });
      console.log("data added");
    } catch (err) {
      console.log(err);
    }
  };

  const getValue = async (key) => {
    try {
      await connect(); // Reconnect if necessary
      const response = await client.get(key);
      console.log(response);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  };

  const getMultiValue = async (key) => {
    try {
      await connect();
      const keys = await client.keys(`${key}:*`);
      if (keys?.length > 0) {
        const values = await client.mGet(keys);
        return values;
      }
      return [];
    } catch (error) {
      console.log(error);
    }
  };

  const flushAll = async () => {
    try {
      await connect(); // Reconnect if necessary
      await client.flushAll();
    } catch (error) {
      console.log(error);
    }
  };

  const disconnect = async () => {
    try {
      await client.disconnect();
      console.log("Redis disconnected!");
    } catch (error) {
      console.log("Error disconnecting:", error.message);
    }
  };

  return { connect, setValue, getValue, getMultiValue, flushAll, disconnect };
};
