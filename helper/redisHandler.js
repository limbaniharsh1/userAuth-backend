import redis from "redis";

export const redisHandler = () => {
  const client = redis.createClient({
    url: process.env.REDIS_URL,
  });

  const connect = () => {
    client
      .connect()
      .then(() => console.log("redis connected successfully!"))
      .catch((err) => err.message);
  };

  const setValue = async (key, value) => {
    await connect()
    await client
      .set(key, value)
      .then(() => console.log("data added"))
      .catch((err) => console.log(err));
  };

  const getValue = async (value) => {
    try {
      const response = await client.get(value);
      console.log(response)
      return response
    } catch (error) {
      console.log(error.message)
    }
  };

  const disconnect = async () => {
    await client.disconnect();
  };
  return { connect, setValue, getValue, disconnect };
};
