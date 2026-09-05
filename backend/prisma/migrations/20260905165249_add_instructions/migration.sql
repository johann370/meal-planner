-- CreateTable
CREATE TABLE "instructions" (
    "id" SERIAL NOT NULL,
    "step" INTEGER NOT NULL,
    "instruction" TEXT NOT NULL,
    "recipe_id" INTEGER,

    CONSTRAINT "instructions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "instructions" ADD CONSTRAINT "instructions_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
