const db = require("./config/db");

db.serialize(() => {
  // Drop accounts table if exists (for fresh setup)
  db.run(`DROP TABLE IF EXISTS accounts;`, (dropErr) => {
    if (dropErr) {
      console.error("❌ Failed to drop accounts table:", dropErr.message);
      return;
    }

    // Create accounts table with secretToken column
    db.run(
      `
      CREATE TABLE accounts (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        website TEXT,
        secretToken TEXT NOT NULL
      )
    `,
      (createErr) => {
        if (createErr) {
          console.error(
            "❌ Failed to create accounts table:",
            createErr.message
          );
          return;
        }
        console.log("✅ Accounts table created.");

        // Create destinations table
        db.run(
          `
          CREATE TABLE IF NOT EXISTS destinations (
            id TEXT PRIMARY KEY,
            accountId TEXT NOT NULL,
            url TEXT NOT NULL,
            httpMethod TEXT NOT NULL,
            headers TEXT NOT NULL,
            FOREIGN KEY (accountId) REFERENCES accounts(id) ON DELETE CASCADE
          )
        `,
          (destErr) => {
            if (destErr) {
              console.error(
                "❌ Failed to create destinations table:",
                destErr.message
              );
            } else {
              console.log("✅ Destinations table ready.");
            }
          }
        );
      }
    );
  });
});
