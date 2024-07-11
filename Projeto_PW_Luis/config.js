const config = {
    db: "mongodb+srv://admin:admin@cluster0.olhuhf9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    secret: "supersecret",
    expiresPassword: 86400, // 24 hours
    saltRounds: 10,
};

module.exports = config;