-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "ingredients" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "quantity" DECIMAL,
    "unit" TEXT,
    "recipe_id" INTEGER,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipes" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "instructions" TEXT,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "week_meal" (
    "id" SERIAL NOT NULL,
    "day" TEXT,
    "recipe_id" INTEGER,

    CONSTRAINT "week_meal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "week_meal" ADD CONSTRAINT "week_meal_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

