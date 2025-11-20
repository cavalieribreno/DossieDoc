"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const caminhoOrigem = 'C:/Users/Brenocp/Desktop/ORIGEM';
const caminhoDestino = 'C:/Users/Brenocp/Desktop/DESTINO';
// Função para ler os diretórios
function lerDiretorio(caminho) {
    try {
        const itens = fs.readdirSync(caminho);
        return itens;
    }
    catch (error) {
        console.error(`❌ Erro ao ler o diretório ${caminho}:`, error);
        return [];
    }
}
// Função para listar dossiês em um diretório (pastas)
function listarDossies(caminho) {
    // Lê o conteúdo do diretório especificado e filtra apenas as pastas
    try {
        const dossies = lerDiretorio(caminho).filter((item) => {
            const caminhoCompleto = path.join(caminho, item);
            return fs.statSync(caminhoCompleto).isDirectory();
        });
        return dossies;
    }
    catch (error) {
        console.error('Erro ao ler o diretório:', error);
        return [];
    }
}
// Função para listar arquivos em um diretório (sem pastas)
function listarArquivos(caminho) {
    // Lê o conteúdo do diretório especificado e filtra apenas os arquivos
    try {
        let arquivos = lerDiretorio(caminho).filter((item) => {
            let caminhoCompleto = path.join(caminho, item);
            return fs.statSync(caminhoCompleto).isFile();
        });
        return arquivos;
    }
    catch (error) {
        console.error('Erro ao ler o diretório:', error);
        return [];
    }
}
// Função para mover arquivos para os dossiês correspondentes
function moverArquivoParaDossie(caminhoOrigem, caminhoDestino, arquivosOrigem, dossiesDestino) {
    // Inicializa contadores para arquivos movidos e não movidos
    let movidos = 0;
    let naoMovidos = 0;
    // Percorre os dossiês vendo se tem algum arquivo com nome correspondente
    dossiesDestino.forEach((dossie) => {
        const arquivosCorrespondentes = arquivosOrigem.filter((arquivo) => {
            return arquivo.includes(dossie);
        });
        const dossiesOrigem = lerDiretorio(caminhoOrigem).filter((dossieOrigem) => {
            let caminhoCompleto = path.join(caminhoOrigem, dossieOrigem);
            return fs.statSync(caminhoCompleto).isDirectory();
        });
        const dossiesCorrespondentes = dossiesOrigem.filter((dossieOrigem) => {
            return dossieOrigem.includes(dossie);
        });
        // Se não existir arquivos ele para (return)
        if (arquivosCorrespondentes.length === 0 && dossiesCorrespondentes.length === 0)
            return;
        // Garante que a pasta de destino exista
        const pastaDestino = path.join(caminhoDestino, dossie);
        if (!fs.existsSync(pastaDestino)) {
            fs.mkdirSync(pastaDestino);
        }
        // Percorre os arquivos da origem correspondentes movendo-os para o destino.
        arquivosCorrespondentes.forEach((arquivo) => {
            const caminhoArquivoOrigem = path.join(caminhoOrigem, arquivo);
            const caminhoDossieDestino = path.join(caminhoDestino, dossie, arquivo);
            try {
                // Move o arquivo.
                fs.renameSync(caminhoArquivoOrigem, caminhoDossieDestino);
                console.log(`Arquivo ${arquivo} movido para o dossiê ${dossie}`);
                movidos++;
            }
            catch (error) {
                console.error(`Erro ao mover o arquivo ${arquivo} para o dossiê ${dossie}:`, error);
                naoMovidos++;
            }
        });
        // Percorre os dossies da origem movendo-os para o destino
        dossiesCorrespondentes.forEach((dossieOrigem) => {
            const caminhoDossieOrigem = path.join(caminhoOrigem, dossie);
            const caminhoDossieDestino = path.join(caminhoDestino, dossie, dossieOrigem);
            try {
                fs.renameSync(caminhoDossieOrigem, caminhoDossieDestino);
                console.log(`Dossiê ${dossieOrigem} movido para dossiê: ${dossie}`);
            }
            catch (error) {
                console.log(error);
            }
        });
    });
}
// Chamada da função
const arquivosOrigem = listarArquivos(caminhoOrigem);
const arquivosDestino = listarArquivos(caminhoDestino);
console.log('Arquivos encontrados:', 'Origem:', arquivosOrigem, 'Destino:', arquivosDestino);
const dossiesOrigem = listarDossies(caminhoOrigem);
const dossiesDestino = listarDossies(caminhoDestino);
console.log('Dossiês encontrados:', 'Origem:', dossiesOrigem, 'Destino:', dossiesDestino);
moverArquivoParaDossie(caminhoOrigem, caminhoDestino, arquivosOrigem, dossiesDestino);
//# sourceMappingURL=code.js.map