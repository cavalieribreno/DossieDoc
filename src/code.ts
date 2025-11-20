import * as fs from 'fs';
import * as path from 'path';

const caminhoOrigem = 'C:/Users/Brenocp/Desktop/ORIGEM';
const caminhoDestino = 'C:/Users/Brenocp/Desktop/DESTINO';
// Função para ler os diretórios
function lerDiretorio(caminho: string): string[]{
    try{
        const itens = fs.readdirSync(caminho);
        return itens;
    } catch (error) {
        console.error(`❌ Erro ao ler o diretório ${caminho}:`, error);
        return [];
    }
}
// Função para listar dossiês em um diretório (pastas)
function listarDossies(caminho: string): string[]{
    // Lê o conteúdo do diretório especificado e filtra apenas as pastas
    try{
        const dossies = lerDiretorio(caminho).filter((item: string) => {
        const caminhoCompleto = path.join(caminho, item);
        return fs.statSync(caminhoCompleto).isDirectory();
    });
    return dossies;
    } catch (error) {
        console.error('Erro ao ler o diretório:', error);
        return [];
    }
}
// Função para listar arquivos em um diretório (sem pastas)
function listarArquivos(caminho: string): string[]{
    // Lê o conteúdo do diretório especificado e filtra apenas os arquivos
    try{
        let arquivos = lerDiretorio(caminho).filter((item: string) => {
        let caminhoCompleto = path.join(caminho, item);
        return fs.statSync(caminhoCompleto).isFile();
    });
    return arquivos;
    } catch (error) {
        console.error('Erro ao ler o diretório:', error);
        return [];
    }
}
// Função para mover arquivos para os dossiês correspondentes
function moverArquivoParaDossie(caminhoOrigem: string, caminhoDestino: string, arquivosOrigem: string[], dossiesDestino: string[]):void {
    // Inicializa contadores para arquivos movidos e não movidos
    let movidos = 0;
    let naoMovidos = 0;
    // Percorre os dossiês vendo se tem algum arquivo com nome correspondente
    dossiesDestino.forEach((dossie: string) => {
        const arquivosCorrespondentes: string[] = arquivosOrigem.filter((arquivo: string) => {
            return arquivo.includes(dossie);
        });
        const dossiesOrigem: string[] = lerDiretorio(caminhoOrigem).filter((dossieOrigem: string)=> {
            let caminhoCompleto = path.join(caminhoOrigem, dossieOrigem);
            return fs.statSync(caminhoCompleto).isDirectory();
        });
        const dossiesCorrespondentes: string[] = dossiesOrigem.filter((dossieOrigem:string) => {
            return dossieOrigem.includes(dossie);
        }) 
        // Se não existir arquivos ele para (return)
        if(arquivosCorrespondentes.length === 0 && dossiesCorrespondentes.length === 0) return;
        // Garante que a pasta de destino exista
        const pastaDestino = path.join(caminhoDestino, dossie)
        if (!fs.existsSync(pastaDestino)){
            fs.mkdirSync(pastaDestino);
        }
        // Percorre os arquivos da origem correspondentes movendo-os para o destino.
        arquivosCorrespondentes.forEach((arquivo: string) => {
            const caminhoArquivoOrigem = path.join(caminhoOrigem, arquivo);
            const caminhoDossieDestino = path.join(caminhoDestino, dossie, arquivo);
            try{
                // Move o arquivo.
                fs.renameSync(caminhoArquivoOrigem, caminhoDossieDestino);
                console.log(`Arquivo ${arquivo} movido para o dossiê ${dossie}`);
                movidos++;
            } catch (error) {
                console.error(`Erro ao mover o arquivo ${arquivo} para o dossiê ${dossie}:`, error);
                naoMovidos++;
            }
        });
        // Percorre os dossies da origem movendo-os para o destino
        dossiesCorrespondentes.forEach((dossieOrigem: string) => {
            const caminhoDossieOrigem = path.join(caminhoOrigem, dossie);
            const caminhoDossieDestino = path.join(caminhoDestino, dossie, dossieOrigem);
            try{
                fs.renameSync(caminhoDossieOrigem, caminhoDossieDestino);
                console.log(`Dossiê ${dossieOrigem} movido para dossiê: ${dossie}`)
            } catch (error){
                console.log(error)
            }
        });
    });
}
// Chamada da função
const arquivosOrigem = listarArquivos(caminhoOrigem);
const arquivosDestino = listarArquivos(caminhoDestino);
console.log('Arquivos encontrados:','Origem:', arquivosOrigem,'Destino:', arquivosDestino);

const dossiesOrigem = listarDossies(caminhoOrigem);
const dossiesDestino = listarDossies(caminhoDestino);
console.log('Dossiês encontrados:','Origem:', dossiesOrigem, 'Destino:', dossiesDestino);

moverArquivoParaDossie(caminhoOrigem, caminhoDestino, arquivosOrigem, dossiesDestino);