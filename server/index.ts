import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import MemoryStore from "memorystore";
import pg from "pg";
import compression from "compression";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import path from "path";
import { readdir, readFile } from "fs/promises";

// Connect using the Internal Render URL, since the App and DB are on Render.
const DATABASE_URL = "postgresql://kef_user:JSiN80Bww3WKOxt9x9LNNAoOlFibV7Z0@dpg-d4spbfkcjiac739oj9rg-a/kef";

const app = express();
const httpServer = createServer(app);
const PgSessionStore = pgSession(session);

// Automatic migration runner - runs all SQL migrations from migrations folder
async function runMigrations() {
  try {
    const client = new pg.Client({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 30000,
    });
    await client.connect();

    try {
      // Create migrations tracking table if it doesn't exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS "_drizzle_migrations" (
          id SERIAL PRIMARY KEY,
          hash TEXT NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Get all migration files
      const migrationsDir = path.resolve(process.cwd(), "migrations");
      const files = await readdir(migrationsDir);
      const sqlFiles = files.filter(f => f.endsWith(".sql")).sort();

      // Apply each migration
      for (const file of sqlFiles) {
        // Skip meta files
        if (file.startsWith("meta") || file === "_journal.json") continue;

        // Check if migration has already been applied
        const result = await client.query(
          "SELECT id FROM _drizzle_migrations WHERE hash = $1",
          [file]
        );

        if (result.rows.length > 0) {
          console.log(`✓ Migration ${file} already applied`);
          continue;
        }

        // Read and execute migration
        const sqlPath = path.join(migrationsDir, file);
        const sql = await readFile(sqlPath, "utf-8");
        
        // Split by statement separator if present
        const statements = sql.split("--> statement-breakpoint").filter(s => s.trim());

        for (const statement of statements) {
          const trimmed = statement.trim();
          if (trimmed) {
            try {
              await client.query(trimmed);
            } catch (err: any) {
              // Ignore errors for IF NOT EXISTS statements that already exist
              if (!err.message.includes("already exists")) {
                console.error(`Error in migration ${file}:`, err.message);
              }
            }
          }
        }

        // Record migration as applied
        await client.query(
          "INSERT INTO _drizzle_migrations (hash) VALUES ($1)",
          [file]
        );

        console.log(`✓ Applied migration ${file}`);
      }

      console.log("✓ All migrations completed");
    } finally {
      await client.end();
    }
  } catch (err) {
    console.error("Migration error (non-fatal, continuing):", err);
    // Don't crash - app can continue with existing schema
  }
}

// Enable gzip compression for all responses - reduces bandwidth by 70-90%
app.use(compression());

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// Trust proxy for Railway, Render, and other hosting platforms
app.set("trust proxy", 1);

// Detect if running on Replit (uses HTTPS proxy) or production
const isSecureEnv = process.env.NODE_ENV === "production" || !!process.env.REPL_ID;

// Create a separate pool for sessions
const sessionPool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
  max: 5,
});

// Handle pool errors gracefully - do NOT crash the server
sessionPool.on('error', (err) => {
  console.error('Session pool error (non-fatal):', err.message);
});

// Ensure session table exists before starting the app
async function ensureSessionTable() {
  try {
    const client = await sessionPool.connect();
    try {
      // Create session table with the same schema as connect-pg-simple expects
      await client.query(`
        CREATE TABLE IF NOT EXISTS "session" (
          "sid" varchar NOT NULL COLLATE "default",
          "sess" json NOT NULL,
          "expire" timestamp(6) NOT NULL,
          PRIMARY KEY ("sid")
        ) WITH (OIDS=FALSE);
        CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
      `);
      console.log('Session table ensured');
    } finally {
      client.release();
    }
  } catch (err: any) {
    // Log but don't crash - the app can still work with in-memory sessions
    console.warn('Failed to ensure session table:', err?.message);
  }
}

// Call this before setting up the session middleware
ensureSessionTable().catch(err => console.warn('Session table setup warning:', err?.message));

// Build session store — fall back to MemoryStore if PostgreSQL session fails
const MemStore = MemoryStore(session);
let sessionStore: session.Store;
try {
  sessionStore = new PgSessionStore({
    pool: sessionPool,
    tableName: 'session',
    createTableIfMissing: true,
    errorLog: (err: Error) => console.error('PgSession error (non-fatal):', err.message),
  });
  console.log('Using PostgreSQL session store');
} catch (err: any) {
  console.warn('PostgreSQL session store failed, using MemoryStore:', err.message);
  sessionStore = new MemStore({ checkPeriod: 86400000 });
}

app.use(
  session({
    store: sessionStore,
    secret: "kerala-economic-forum-admin-secret-key-2024",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isSecureEnv,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: isSecureEnv ? "none" : "lax"
    }
  })
);

app.use(
  express.json({
    limit: '50mb', // Allow large base64 encoded files
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Serve static assets from attached_assets folder with caching
// Use process.cwd() which works reliably in both dev and production environments
// Updated: Added KEF Leadership Lab program details (Feb 5, 2026)
const assetsPath = path.resolve(process.cwd(), "attached_assets");
app.use("/assets", express.static(assetsPath, {
  maxAge: '1d', // Cache for 1 day
  etag: true,
  lastModified: true
}));

// Serve uploaded files from public/uploads folder with caching
const uploadsPath = path.resolve(process.cwd(), "public/uploads");
app.use("/uploads", express.static(uploadsPath, {
  maxAge: '7d', // Cache uploads for 7 days
  etag: true,
  lastModified: true
}));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Run migrations first
  console.log("Running database migrations...");
  await runMigrations();

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: process.env.HOST || "0.0.0.0",
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
