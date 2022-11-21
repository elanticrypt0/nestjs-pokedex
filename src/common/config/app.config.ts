
export const EnvConfiguration= () => ({

    enviroment: process.env.NODE_ENV || 'dev',
    mongodb: process.env.MONGO_DB,
    port: process.env.PORT || 3000


});