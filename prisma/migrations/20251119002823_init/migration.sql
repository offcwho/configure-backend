/*
  Warnings:

  - You are about to drop the column `w` on the `Component` table. All the data in the column will be lost.
  - You are about to drop the column `w` on the `Configure` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Component" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL,
    "images" JSONB,
    "socket" TEXT,
    "ddr" TEXT,
    "watt" INTEGER
);
INSERT INTO "new_Component" ("createdAt", "ddr", "description", "id", "images", "name", "price", "socket", "type", "updatedAt") SELECT "createdAt", "ddr", "description", "id", "images", "name", "price", "socket", "type", "updatedAt" FROM "Component";
DROP TABLE "Component";
ALTER TABLE "new_Component" RENAME TO "Component";
CREATE TABLE "new_Configure" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "socket" TEXT,
    "ddr" TEXT,
    "watt" INTEGER,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Configure_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Configure" ("createdAt", "ddr", "id", "name", "socket", "updatedAt", "userId") SELECT "createdAt", "ddr", "id", "name", "socket", "updatedAt", "userId" FROM "Configure";
DROP TABLE "Configure";
ALTER TABLE "new_Configure" RENAME TO "Configure";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
