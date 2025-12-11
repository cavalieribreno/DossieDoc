import * as fs from 'fs/promises';
import * as path from 'path';
const caminhoOrigem = 'C:/Users/Brenocp/Desktop/ORIGEM';
const caminhoDestino = 'C:/Users/Brenocp/Desktop/DESTINO';
// Classe para leitura de diretórios
class leituraDiretorio {
    // Método para listagem de itens em um diretório
    async listarDiretorio(caminho) {
        try {
            const itens = await fs.readdir(caminho, { withFileTypes: true });
            return itens;
        }
        catch (error) {
            console.error(`❌ Erro ao ler o diretório ${caminho}:`, error);
            return [];
        }
    }
    // Método para listar apenas arquivos em um diretório
    async listarArquivos(caminho) {
        try {
            const arquivos = await this.listarDiretorio(caminho);
            // Filtra utilizando o objeto Dirent e retorna apenas os nomes dos arquivos
            return arquivos.filter((arquivo) => arquivo.isFile()).map((arquivo) => arquivo.name);
        }
        catch (error) {
            console.error(`❌ Erro ao listar arquivos no diretório ${caminho}:`, error);
            return [];
        }
    }
    // Método para listar apenas dossiês (diretórios) em um diretório
    async listarDossies(caminho) {
        try {
            const dossies = await this.listarDiretorio(caminho);
            // Filtra utilizando o objeto Dirent e retorna apenas os nomes dos diretórios
            return dossies.filter((dossie) => dossie.isDirectory()).map((dossie) => dossie.name);
        }
        catch (error) {
            console.error(`❌ Erro ao listar dossiês no diretório ${caminho}:`, error);
            return [];
        }
    }
}
// Classe para mover itens entre diretórios
class moverItens {
    // Método para mover arquivos para dossiês correspondentes
    async moverArquivo(caminhoOrigem, caminhoDestino, arquivosOrigem, dossiesDestino) {
        // Verifica se tem arquivos e dossiês para processar
        if (arquivosOrigem.length === 0 || dossiesDestino.length === 0)
            return false;
        // Itera sobre cada dossiê de destino e filtra os arquivos correspondentes
        for (const dossieDestino of dossiesDestino) {
            const arquivosCorrespondentes = arquivosOrigem.filter((arquivo) => {
                return arquivo.includes(dossieDestino);
            });
            if (arquivosCorrespondentes.length === 0)
                return false;
            // Move cada arquivo correspondente para o dossiê de destino
            for (const arquivo of arquivosCorrespondentes) {
                const caminhoArquivoOrigem = path.join(caminhoOrigem, arquivo);
                const caminhoArquivoDestino = path.join(caminhoDestino, dossieDestino, arquivo);
                try {
                    await fs.rename(caminhoArquivoOrigem, caminhoArquivoDestino);
                    console.log(`Arquivo: ${arquivo} movido para dossiê: ${dossieDestino}`);
                }
                catch (error) {
                    console.log(error);
                }
            }
            ;
        }
        ;
        return true;
    }
    // Método para mover dossiês para dossiês correspondentes
    async moverDossies(caminhoOrigem, caminhoDestino, dossiesOrigem, dossiesDestino) {
        // Verifica se tem dossiês para processar
        if (dossiesOrigem.length === 0 || dossiesDestino.length === 0)
            return false;
        // Itera sobre cada dossiê de destino e filtra os dossiês correspondentes
        for (const dossieDestino of dossiesDestino) {
            const dossiesCorrespondentes = dossiesOrigem.filter((dossieOrigem) => {
                return dossieOrigem.includes(dossieDestino);
            });
            if (dossiesCorrespondentes.length === 0)
                return false;
            for (const dossie of dossiesCorrespondentes) {
                const caminhoDossieOrigem = path.join(caminhoOrigem, dossie);
                const caminhoDossieDestino = path.join(caminhoDestino, dossieDestino, dossie);
                try {
                    await fs.rename(caminhoDossieOrigem, caminhoDossieDestino);
                    console.log(`Dossiê: ${dossie} movido para dossiê: ${dossieDestino}`);
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
        ;
        return true;
    }
    // Método para mover todos os itens (arquivos e dossiês)
    async moverTudo(caminhoOrigem, caminhoDestino, arquivosOrigem, dossiesOrigem, dossiesDestino) {
        await this.moverArquivo(caminhoOrigem, caminhoDestino, arquivosOrigem, dossiesDestino);
        await this.moverDossies(caminhoOrigem, caminhoDestino, dossiesOrigem, dossiesDestino);
        return true;
    }
}
const leitor = new leituraDiretorio();
const mover = new moverItens();
const arquivosOrigem = await leitor.listarArquivos(caminhoOrigem);
console.log(arquivosOrigem);
const dossiesOrigem = await leitor.listarDossies(caminhoOrigem);
console.log(dossiesOrigem);
const dossiesDestino = await leitor.listarDossies(caminhoDestino);
console.log(dossiesDestino);
mover.moverTudo(caminhoOrigem, caminhoDestino, arquivosOrigem, dossiesOrigem, dossiesDestino);
//# sourceMappingURL=code.js.map