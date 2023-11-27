import { Client, Storage } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('653ba1e628cbfad98946')
  .setKey(
    '145e1e819aacea1ffc97e46e6bce85535398ab472c5b953d1b1466710c40fb035d85d42f14f1baa64b1d9695cb66ecb4df359a7d9a9e65623e0e62c8d760bd633f31256673ab5f9e44e035d5494d989d4cb92daad8b02363e76433de7d4cebb18c7c1c0bdb6970fa72c671241005549decad5d92d2c6f1588e02b376b9eefe60',
  );

export const appwriteStorage = new Storage(client);
