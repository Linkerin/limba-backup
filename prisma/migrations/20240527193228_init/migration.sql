-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('f', 'm', 'n');

-- CreateTable
CREATE TABLE "words" (
    "id" SERIAL NOT NULL,
    "en" TEXT NOT NULL,
    "en_alternatives" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ro" TEXT NOT NULL,
    "gender_ro" "Gender",
    "set_id" INTEGER NOT NULL,
    "img_name" TEXT,
    "audio_name" TEXT,
    "plural" BOOLEAN NOT NULL DEFAULT false,
    "example_ro" TEXT,
    "example_en" TEXT,
    "instagram" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sets" (
    "id" SERIAL NOT NULL,
    "set" VARCHAR(255) NOT NULL,
    "emoji" VARCHAR(255),
    "unit" INTEGER NOT NULL,
    "prev_set_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "words_en_key" ON "words"("en");

-- CreateIndex
CREATE UNIQUE INDEX "words_ro_key" ON "words"("ro");

-- CreateIndex
CREATE UNIQUE INDEX "words_img_name_key" ON "words"("img_name");

-- CreateIndex
CREATE UNIQUE INDEX "words_audio_name_key" ON "words"("audio_name");

-- CreateIndex
CREATE UNIQUE INDEX "sets_set_key" ON "sets"("set");

-- AddForeignKey
ALTER TABLE "words" ADD CONSTRAINT "words_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
