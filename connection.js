const { DATABASE_CONFIG } = require("../../config");
const { connect: mongooseConnect } = require("mongoose");

class DatabaseConnection {
  static async connect() {
    // connect database
    try {
      await mongooseConnect(DATABASE_CONFIG.URL, DATABASE_CONFIG.OPTIONS);
      console.log(`[Mongoose]: Database connected`);
    } catch (err) {
      console.log("[Mongoose]: Cannot connect to database", err);
      process.exit(1);
    }
  }
}

module.exports = {
  DatabaseConnection,
};
