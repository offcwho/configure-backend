-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_component_on_configure" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "configureId" INTEGER NOT NULL,
    "componentId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "component_on_configure_configureId_fkey" FOREIGN KEY ("configureId") REFERENCES "Configure" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "component_on_configure_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_component_on_configure" ("componentId", "configureId", "id", "quantity") SELECT "componentId", "configureId", "id", "quantity" FROM "component_on_configure";
DROP TABLE "component_on_configure";
ALTER TABLE "new_component_on_configure" RENAME TO "component_on_configure";
CREATE UNIQUE INDEX "component_on_configure_configureId_componentId_key" ON "component_on_configure"("configureId", "componentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
