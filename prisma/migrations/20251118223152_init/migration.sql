-- AlterTable
ALTER TABLE "Component" ADD COLUMN "socket" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Configure" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "socket" TEXT NOT NULL DEFAULT 'null',
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Configure_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Configure" ("createdAt", "id", "name", "updatedAt", "userId") SELECT "createdAt", "id", "name", "updatedAt", "userId" FROM "Configure";
DROP TABLE "Configure";
ALTER TABLE "new_Configure" RENAME TO "Configure";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
