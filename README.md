# Desafio Full-Stack | Forte Tecnologias

Olá, candidato(a)! Seja bem-vindo(a) ao nosso desafio de código.

Este teste foi projetado para simular um problema do mundo real e nos ajudar a entender suas habilidades técnicas em um ambiente prático. O objetivo é construir uma aplicação Full-Stack simples, mas bem estruturada, utilizando as tecnologias que usamos aqui na Forte Tecnologias.

**Boa sorte!**

## Stacks do Desafio

-   **Backend**: NestJS, Prisma ORM com PostgreSQL, Docker.
-   **Frontend**: Angular (Material).

## O Cenário: Forte Asset Manager

Você foi encarregado(a) de criar um pequeno sistema interno para a Forte Tecnologias chamado **"Forte Asset Manager"**. O sistema deve permitir que o departamento de TI gerencie os ativos da empresa (como notebooks e monitores) e os associe aos funcionários.

Este sistema resolverá um problema comum: saber qual funcionário está com qual equipamento e quais equipamentos estão disponíveis.

## Requisitos Funcionais

### Backend

Você deverá criar uma API RESTful com os seguintes recursos:

1.  **CRUD de Empresas (`Companies`)**:
    -   Uma empresa deve ter `id`, `name` e `cnpj`.
    -   Endpoints para criar, listar, buscar por id, atualizar e remover uma empresa.

2.  **CRUD de Funcionários (`Employees`)**:
    -   Um funcionário deve ter `id`, `name`, `email` e `cpf`.
    -   Um funcionário **deve pertencer a uma empresa**.
    -   Endpoints para criar, listar, buscar por id, atualizar e remover um funcionário.

3.  **CRUD de Ativos (`Assets`)**:
    -   Um ativo deve ter `id`, `name`, `type` (ex: 'Notebook', 'Monitor', 'Celular') e um `status` (ex: 'Disponível', 'Em Uso', 'Em Manutenção').
    -   Endpoints para criar, listar, buscar por id, atualizar e remover um ativo.

4.  **Lógica de Associação de Ativos**:
    -   **Endpoint para Associar um Ativo**: Crie um endpoint que associe um ativo `Disponível` a um funcionário.
        -   Ao associar, o status do ativo deve mudar para `Em Uso`.
        -   **Regra de negócio crucial**: Um funcionário só pode ter **um único ativo do tipo 'Notebook'** associado a ele por vez. A API deve retornar um erro caso essa regra seja violada.
    -   **Endpoint para Desassociar um Ativo**: Crie um endpoint que remova a associação de um ativo com um funcionário.
        -   Ao desassociar, o status do ativo deve voltar para `Disponível`.

5.  **Endpoints de Listagem**:
    -   Um endpoint para listar todos os funcionários de uma determinada empresa.
    -   Um endpoint para listar todos os ativos associados a um determinado funcionário.

### Frontend

Você deverá criar uma interface de usuário simples para interagir com a API.

1.  **Página de Empresas**:
    -   Listar todas as empresas.
    -   Permitir a criação de uma nova empresa.

2.  **Página de Detalhes da Empresa**:
    -   Ao clicar em uma empresa, o usuário deve ser levado para uma página que mostra os detalhes da empresa e **lista todos os seus funcionários**.
    -   Nessa página, deve ser possível adicionar novos funcionários àquela empresa.

3.  **Página de Gestão de Ativos do Funcionário**:
    -   Na lista de funcionários, deve haver uma opção para "Gerenciar Ativos".
    -   Esta página deve mostrar os ativos já associados ao funcionário e permitir a **associação de novos ativos disponíveis** e a **desassociação** dos existentes.

## Requisitos Técnicos

-   **Backend**:
    -   O projeto deve ser construído com **NestJS**.
    -   A persistência de dados deve ser feita com **Prisma ORM** e um banco de dados **PostgreSQL**.
    -   O banco de dados PostgreSQL deve ser executado em um container **Docker** via `docker-compose.yml`.
    -   É **obrigatório** seguir o padrão de arquitetura **Controller-Service-Repository (CSR)**.
        -   **Controllers**: Apenas recebem requisições, validam DTOs e chamam os services.
        -   **Services**: Contêm toda a lógica de negócio (ex: a regra de um notebook por funcionário). **Não devem interagir diretamente com o Prisma**.
        -   **Repositories**: Camada de acesso a dados. É o **único lugar** onde o `PrismaClient` deve ser utilizado.

-   **Frontend**:
    -   O projeto deve ser construído com **Angular**.
    -   A aplicação deve ser reativa e consumir os endpoints criados no backend.
    -   Estruture a aplicação de forma organizada, separando componentes, serviços e modelos.

## Estrutura do Repositório

Após forkar este repositório, você deverá criar a seguinte estrutura de pastas na raiz do projeto:

```
/
├── backend/      # Projeto NestJS
├── frontend/     # Projeto Angular
└── README.md     # Este arquivo
```

Você é responsável por iniciar ambos os projetos do zero.

## O que Esperamos de Você

1.  Faça um **fork** deste repositório.
2.  Crie sua solução em seu próprio repositório forkado.
3.  Utilize `git` para versionar seu progresso com commits claros e objetivos.
4.  Ao finalizar, nos envie o link do seu repositório. Não é necessário abrir um Pull Request para este repositório original.

## Pontos Bônus (Opcional)

Estes itens não são obrigatórios, mas serão vistos como um grande diferencial:

-   **Testes Automatizados**:
    -   No backend: Testes unitários para os *services*, validando as regras de negócio.
    -   No frontend: Testes unitários para os componentes.
-   **Validação de Dados**: Utilização de `class-validator` e `class-transformer` no backend para os DTOs.
-   **Documentação da API**: Geração de documentação dos endpoints com Swagger (OpenAPI) no NestJS.
-   **Tratamento de Erros**: Um tratamento de erros robusto tanto no backend quanto no frontend, exibindo mensagens claras para o usuário.
-   **UI/UX**: Uma interface limpa e intuitiva no frontend, utilizando alguma biblioteca de componentes como Angular Material.

## Critérios de Avaliação

Nós avaliaremos os seguintes pontos:

-   **Funcionalidade**: A aplicação atende a todos os requisitos funcionais descritos?
-   **Qualidade do Código**: O código está limpo, legível, bem organizado e segue as melhores práticas de cada tecnologia?
-   **Arquitetura**: A estrutura do projeto (especialmente a adesão ao padrão CSR no backend) está bem definida e escalável?
-   **Modelagem de Dados**: O schema do Prisma está bem modelado e os relacionamentos fazem sentido?
-   **Uso de Git**: A qualidade das mensagens de commit e a organização do histórico.
-   **Diferenciais**: A implementação dos pontos bônus.

Qualquer dúvida, estamos à disposição. Bom trabalho
