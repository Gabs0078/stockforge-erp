# StockForge ERP

MVP de gestão de estoque desenvolvido para projeto acadêmico. A aplicação usa React no front-end, Node.js no back-end, MariaDB/MySQL como banco de dados e Docker com Nginx como proxy reverso.

## Objetivo

Criar uma base simples de ERP para controle de produtos, fornecedores, galpões e movimentações de estoque. O sistema foi pensado para atender à rubrica da faculdade e também servir como base para evolução futura de um ERP próprio.

## Tecnologias

- React + Vite
- Node.js + Express
- Sequelize + mysql2
- MariaDB/MySQL
- Docker e Docker Compose
- Nginx como proxy reverso
- HTTPS local com certificado próprio
- Basic Auth no Nginx
- Headers básicos de segurança
- Jest para testes básicos

## CRUDs implementados

1. Fornecedores
   - Nome fantasia
   - Razão social
   - CNPJ
   - E-mail
   - Telefone

2. Galpões
   - Nome
   - Código
   - Endereço
   - Responsável

3. Produtos
   - Nome
   - SKU
   - Categoria
   - Quantidade
   - Estoque mínimo
   - Preço de custo
   - Fornecedor
   - Galpão

4. Movimentações de estoque
   - Produto
   - Tipo: entrada ou saída
   - Quantidade
   - Observação

## Validações

- Campos obrigatórios
- E-mail válido
- CNPJ válido
- Quantidade não negativa
- Preço de custo não negativo
- SKU único por galpão
- Saída de estoque não pode ser maior que a quantidade disponível

## Regras de negócio principais

- Um produto não pode ter o mesmo SKU repetido dentro do mesmo galpão.
- O mesmo SKU pode existir em galpões diferentes.
- Movimentação do tipo entrada soma ao estoque.
- Movimentação do tipo saída subtrai do estoque.
- A saída é bloqueada quando não existe saldo suficiente.

## Arquitetura Docker

Serviços do `docker-compose.yml`:

- `nginx`: único serviço exposto ao usuário, nas portas 80 e 443.
- `frontend`: aplicação React compilada e servida internamente pelo Nginx.
- `backend`: API Node.js/Express, exposta apenas na rede interna Docker.
- `mysql`: banco MariaDB, sem exposição direta para fora do Docker.

O banco usa volume persistente chamado `mysql_data`.

## Segurança aplicada

- Nginx como proxy reverso.
- Apenas o Nginx é exposto externamente.
- Banco de dados e back-end ficam em rede interna Docker.
- Uso de `.env` para variáveis sensíveis.
- Headers básicos de segurança no Nginx:
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
  - `Content-Security-Policy`
- Basic Auth no acesso ao sistema.
- HTTPS local.

Usuário e senha padrão do Basic Auth:

```txt
Usuário: admin
Senha: admin123
```

> Em um ambiente real, essa senha deve ser alterada.

## Como rodar no Linux

### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd stockforge-erp
```

### 2. Criar o arquivo `.env`

```bash
cp .env.example .env
```

### 3. Criar certificado local

Opção simples com OpenSSL:

```bash
mkdir -p certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout certs/localhost-key.pem \
  -out certs/localhost.pem \
  -subj "/CN=localhost"
```

### 4. Subir os containers

```bash
docker compose up --build
```

### 5. Acessar

Abra no navegador:

```txt
https://localhost
```

O navegador pode avisar que o certificado é local/não confiável. Para trabalho acadêmico local, isso é esperado.

## SQL do banco

O arquivo de criação do banco está em:

```txt
database/init.sql
```

Ele cria as tabelas:

- `suppliers`
- `warehouses`
- `products`
- `stock_movements`

Também insere alguns dados de exemplo.

## Importação CSV

A API possui endpoint para importação de produtos por CSV:

```txt
POST /api/products/import-csv
```

Formato esperado do CSV:

```csv
nome,sku,categoria,quantidade,estoque_minimo,preco_custo,fornecedor_id,galpao_id
Cimento CP-II,CIM-CP2-50,Construção,50,10,32.90,1,1
```

Essa funcionalidade é extra e pode ser evoluída depois na interface.

## Testes

Há testes básicos para validação de CNPJ.

Para rodar os testes do back-end:

```bash
cd backend
npm install
npm test
```

## Organização de branches sugerida

- `main`: versão final entregue.
- `dev`: desenvolvimento geral.
- `feature/crud-produtos`: implementação do CRUD de produtos.
- `feature/docker-nginx`: configuração Docker/Nginx.

## Checklist da rubrica

- [x] Front-end em ReactJS
- [x] Back-end em NodeJS
- [x] Banco de dados MySQL/MariaDB
- [x] Mínimo de 3 CRUDs
- [x] Validação de CNPJ
- [x] Validação de e-mail
- [x] Validação de campos obrigatórios
- [x] Validação de regra de negócio no back-end
- [x] Docker Compose
- [x] Nginx como proxy reverso
- [x] HTTPS local
- [x] Basic Auth
- [x] Headers básicos de segurança
- [x] Banco sem exposição externa
- [x] Volume persistente do banco
- [x] Arquivo SQL de criação do banco
- [x] README com instruções

## Observação

Este projeto é um MVP acadêmico. Ele não possui autenticação por usuário dentro da aplicação, controle avançado de permissões ou relatórios completos. Esses pontos podem ser adicionados em versões futuras.
