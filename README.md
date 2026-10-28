# Lista de Tarefas

Aplicação full-stack simples para cadastrar, listar, editar, atualizar o status e excluir tarefas. O frontend é feito com HTML, CSS e JavaScript sem framework; a API usa Node.js e Express; e os dados ficam em MySQL executado pelo Docker Compose.

## Tecnologias

- **Frontend:** HTML, CSS e JavaScript.
- **Backend:** Node.js, Express, `mysql2` e `dotenv`.
- **Banco de dados:** MySQL 8.4.
- **Ambiente do banco:** Docker Compose.

## Pré-requisitos

Instale e deixe disponíveis no terminal:

- [Node.js](https://nodejs.org/) e npm.
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) ou Docker Engine com o plugin Docker Compose.
- Um navegador.
- Opcional: extensão Live Server no VS Code para servir o frontend localmente.

## Estrutura do projeto

```text
.
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── router.js
│       ├── server.js
│       ├── controllers/
│       ├── middlewares/
│       └── models/
└── frontend/
    ├── index.html
    ├── css/
    └── js/
```

### Responsabilidade de cada parte

- `frontend/`: interface, interação com o usuário e chamadas HTTP para a API.
- `backend/src/controllers/`: recebe as requisições e coordena as operações.
- `backend/src/middlewares/`: valida os títulos e os status enviados à API.
- `backend/src/models/`: consulta e altera os registros do MySQL.
- `backend/src/models/connection.js`: cria a conexão com base nas variáveis do `backend/.env`.
- `database/init.sql`: cria o banco `todolist` e a tabela `tasks` na primeira inicialização do volume do MySQL.
- `docker-compose.yml`: configura e inicia o serviço MySQL, publica a porta e mantém os dados em um volume Docker.

## Como iniciar a aplicação

Use três terminais, mantendo os processos do Docker e do backend em execução.

### 1. Inicie o MySQL

Na raiz do projeto:

```bash
docker compose up -d
```

Esse comando baixa a imagem `mysql:8.4` se necessário, inicia o container `todolist-mysql`, publica o MySQL em `127.0.0.1:3306` e cria o banco e a tabela automaticamente na primeira inicialização.

Confira o estado:

```bash
docker compose ps
```

Espere o status do serviço ficar `healthy` antes de iniciar o backend. Para acompanhar a inicialização:

```bash
docker compose logs -f mysql
```

Quando terminar de acompanhar os logs, use `Ctrl+C`; isso encerra a visualização dos logs, não o container.

#### Configuração do MySQL

Por padrão, o Compose configura:

| Configuração | Valor |
|---|---|
| Host | `127.0.0.1` |
| Porta | `3306` |
| Banco | `todolist` |
| Usuário | `root` |
| Senha inicial | `root` |

A senha padrão é para desenvolvimento local. Para definir outra, crie um arquivo `.env` na raiz do projeto com:

```env
MYSQL_ROOT_PASSWORD=sua_senha_local
```

Use a mesma senha em `backend/.env` (passo seguinte). O arquivo `backend/.env` é ignorado pelo Git; não adicione credenciais reais ao repositório.

> **Atenção aos dados persistidos:** o MySQL guarda os dados no volume `mysql_data`. O script de `database/init.sql` roda automaticamente apenas quando o volume é criado pela primeira vez. Alterar a senha no Compose não altera a senha de um banco que já foi inicializado. Não use `docker compose down -v` para solucionar problemas sem querer apagar o banco: a opção `-v` remove o volume e seus dados.

### 2. Configure e inicie o backend

Em outro terminal, dentro da pasta `backend`, instale as dependências:

```bash
cd backend
npm install
```

Crie o arquivo local de configuração copiando o exemplo:

```bash
cp .env.example .env
```

No Windows PowerShell, o comando equivalente é:

```powershell
Copy-Item .env.example .env
```

Confira se `backend/.env` contém os valores adequados. Com as configurações padrão:

```env
PORT=3333
MYSQL_HOST=127.0.0.1
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DB=todolist
```

Se definiu uma senha diferente para o MySQL, atualize `MYSQL_PASSWORD` para usar a mesma senha. Inicie o servidor com `npm start`:

```bash
npm start
```

O terminal deve indicar que o servidor está na porta `3333`. Mantenha esse terminal aberto enquanto usa a aplicação. Como alternativa para desenvolvimento com reinicialização automática ao alterar arquivos, use `npm run dev`.

### 3. Abra o frontend

Com o backend em execução, abra `frontend/index.html` usando Live Server (clique com o botão direito no arquivo e escolha **Open with Live Server**). A aplicação usa a API em `http://localhost:3333/tasks`.

Também é possível abrir o arquivo HTML diretamente no navegador. Se o navegador bloquear as requisições locais, use um servidor estático, como Live Server.

## Usando a aplicação

- **Adicionar:** digite o título e envie o formulário pelo botão `+`.
- **Editar título:** clique no ícone de edição e altere o texto. Pressione **Enter** para salvar ou **Escape** para cancelar sem salvar as alterações.
- **Alterar status:** selecione um status na lista; a alteração é salva na API.
- **Excluir:** clique no ícone de lixeira.

Os status aceitos são `pendente`, `em andamento` e `concluida`.
As datas das tarefas são armazenadas em UTC e exibidas no horário de São Paulo (GMT−3), independentemente do fuso configurado no computador.

## API

A API é servida pelo backend em `http://localhost:3333`.

| Método | Endpoint | Função | Resposta esperada |
|---|---|---|---|
| `GET` | `/tasks` | Lista as tarefas. | `200` e uma lista JSON. |
| `POST` | `/tasks` | Cria uma tarefa. | `201` e o identificador gerado. |
| `PUT` | `/tasks/:id` | Atualiza título e status. | `204` sem conteúdo. |
| `DELETE` | `/tasks/:id` | Exclui uma tarefa. | `204` sem conteúdo. |

Exemplo de criação:

```json
{
  "title": "Estudar JavaScript"
}
```

Exemplo de atualização:

```json
{
  "title": "Estudar JavaScript",
  "status": "em andamento"
}
```

As requisições `POST` e `PUT` devem enviar `Content-Type: application/json`. A API rejeita títulos vazios e status fora da lista permitida.

## Encerrar e reiniciar

Para parar o MySQL sem excluir os dados:

```bash
docker compose stop
```

Para iniciá-lo novamente:

```bash
docker compose start
```

Ou pare e remova o container mantendo o volume:

```bash
docker compose down
```

Depois, `docker compose up -d` recria o container usando os dados persistidos. Para parar o backend, pressione `Ctrl+C` no terminal em que `npm start` está rodando.

## Solução de problemas

### Não conecta à porta 3306

1. Verifique se o Docker está iniciado.
2. Na raiz do projeto, execute `docker compose ps` e aguarde o estado `healthy`.
3. Consulte os logs com `docker compose logs mysql`.
4. Verifique se outro MySQL ou container já está usando a porta 3306. Se necessário, pare o serviço que ocupa a porta ou altere o mapeamento no Compose e ajuste a conexão do backend.

### Erro de autenticação ou banco inacessível

- Confira `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD` e `MYSQL_DB` em `backend/.env`.
- Garanta que a senha no backend seja a mesma senha configurada quando o volume do MySQL foi inicializado.
- Se já havia um volume de banco, lembre-se de que mudanças em `MYSQL_ROOT_PASSWORD` e `database/init.sql` não são reaplicadas automaticamente a esse volume.

### Backend não inicia

- Execute `npm install` dentro de `backend/`.
- Confira se a porta `3333` está livre.
- Leia a mensagem exibida no terminal; o backend precisa do MySQL disponível para responder às operações de tarefas.

### Frontend não carrega tarefas

- Confirme que o backend está em execução e que a URL `http://localhost:3333/tasks` responde.
- Abra o frontend por um servidor local, como Live Server.
- Consulte o console e a aba **Network** nas ferramentas de desenvolvedor do navegador para ver erros de conexão ou respostas da API.

## Testes

O `package.json` do backend ainda não define uma suíte de testes automatizados. É possível verificar a sintaxe do JavaScript do frontend com:

```bash
node --check frontend/js/script.js
```

E executar o ESLint do backend:

```bash
cd backend
npm exec -- eslint src/controllers/tasksController.js src/models/tasksModel.js src/middlewares/tasksMiddlewares.js src/router.js src/app.js src/server.js
```
