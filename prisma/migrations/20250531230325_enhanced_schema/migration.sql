/*
  Warnings:

  - You are about to drop the `Graduacao` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Mensalidade" ADD COLUMN "comprovante" TEXT;
ALTER TABLE "Mensalidade" ADD COLUMN "metodoPagamento" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Graduacao";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Perfil" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "telefone" TEXT,
    "endereco" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Perfil_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Plano" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HistoricoGraduacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "alunoId" INTEGER NOT NULL,
    "faixaAnterior" TEXT,
    "grauAnterior" INTEGER DEFAULT 0,
    "faixaNova" TEXT NOT NULL,
    "grauNovo" INTEGER NOT NULL DEFAULT 0,
    "dataGraduacao" DATETIME NOT NULL,
    "quantidadeAulas" INTEGER,
    "professor" TEXT,
    "observacoes" TEXT,
    "fotos" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HistoricoGraduacao_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RequisitoGraduacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "faixa" TEXT NOT NULL,
    "grau" INTEGER NOT NULL DEFAULT 0,
    "proximaFaixa" TEXT NOT NULL,
    "proximoGrau" INTEGER NOT NULL DEFAULT 0,
    "aulasNecessarias" INTEGER NOT NULL,
    "tempoMinimo" INTEGER,
    "descricao" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Aula" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "professorId" INTEGER,
    "diaSemana" TEXT NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFim" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Aluno" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dataNascimento" DATETIME,
    "telefone" TEXT,
    "endereco" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "faixa" TEXT,
    "grau" INTEGER DEFAULT 0,
    "dataInicio" DATETIME,
    "observacoes" TEXT,
    "aulasDesdeUltGrad" INTEGER NOT NULL DEFAULT 0,
    "planoId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Aluno_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "Plano" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Aluno" ("ativo", "createdAt", "dataInicio", "dataNascimento", "email", "endereco", "faixa", "grau", "id", "nome", "observacoes", "telefone", "updatedAt") SELECT "ativo", "createdAt", "dataInicio", "dataNascimento", "email", "endereco", "faixa", "grau", "id", "nome", "observacoes", "telefone", "updatedAt" FROM "Aluno";
DROP TABLE "Aluno";
ALTER TABLE "new_Aluno" RENAME TO "Aluno";
CREATE UNIQUE INDEX "Aluno_email_key" ON "Aluno"("email");
CREATE TABLE "new_Presenca" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "alunoId" INTEGER NOT NULL,
    "aulaId" INTEGER,
    "data" DATETIME NOT NULL,
    "presente" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Presenca_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Presenca_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "Aula" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Presenca" ("alunoId", "createdAt", "data", "id", "presente", "updatedAt") SELECT "alunoId", "createdAt", "data", "id", "presente", "updatedAt" FROM "Presenca";
DROP TABLE "Presenca";
ALTER TABLE "new_Presenca" RENAME TO "Presenca";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "role" TEXT NOT NULL DEFAULT 'aluno',
    "refreshToken" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("avatar", "createdAt", "email", "id", "name", "password", "updatedAt") SELECT "avatar", "createdAt", "email", "id", "name", "password", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Perfil_userId_key" ON "Perfil"("userId");
