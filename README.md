# MuraNight Website

Site estatico pronto para publicar no GitHub Pages.

## Como publicar

1. Crie um repositorio no GitHub e envie estes arquivos para a branch `main`.
2. No GitHub, abra `Settings > Pages`.
3. Em `Build and deployment`, selecione `Source: GitHub Actions`.
4. Depois do primeiro push, o workflow `.github/workflows/pages.yml` fara o deploy automaticamente.

## Estrutura

- `index.html`: pagina principal
- `privacy.html`: politica de privacidade
- `main.js`: internacionalizacao e interacoes
- `assets/` e `locales/`: arquivos estaticos usados pelo site
