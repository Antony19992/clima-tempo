> Execute o seguinte comando para criar a imagem:
```bash
docker build -t renderizador-pagina .
```
> Depois de criar a imagem, execute o seguinte comando para rodar o container:
```bash
docker run -d -p 8080:80 --name renderizador-container renderizador-pagina
```
> Abra seu navegador e acesse:
```bash
http://localhost:8080
```