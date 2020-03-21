const MongoClient = require('mongodb').MongoClient;

const loadConfig = () => {
    return {
        mongodb: new MongoClient(process.env.MONGO_DB_URL, {
            useNewUrlParser: true, 
            useUnifiedTopology: true })
    }
}

const testConnections = (conns) => {
    const p = [];
    p.push(new Promise(
        (resolve, reject) => {
            conns.mongodb.connect(
                err => {
                    if(err)
                        return reject(err);
                    console.info("Connect test OK");
                    resolve();
                }
            )
        }
    ))

    return (Promise.all(p));
}

module.exports = { loadConfig , testConnections}
