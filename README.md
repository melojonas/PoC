## Funcionalidades Principais Inseridas

### Adicionar Instituição
- Permite adicionar uma nova instituição com nome, UF e quantidade de alunos.
- Os dados são enviados via API para o backend e salvos no banco de dados.
- A tabela de instituições e o gráfico são atualizados automaticamente após a adição.

### Editar Instituição
- Permite editar as informações de uma instituição existente.
- Os dados alterados são enviados via API para o backend e atualizados no banco de dados.
- A tabela de instituições e o gráfico são atualizados automaticamente após a edição.

### Excluir Instituição
- Permite excluir uma instituição existente e requer confirmação do usuário.
- A instituição é removida do banco de dados via API.
- A tabela de instituições e o gráfico são atualizados automaticamente após a exclusão.

### Listar Instituições
- Exibe uma tabela com a lista de todas as instituições cadastradas.
- A tabela inclui colunas para nome, UF, quantidade de alunos, editar e excluir.
- Há funcionalidade de ordenação e paginação na tabela.

### Gráfico de Quantidade de Alunos por UF
- Exibe um gráfico de barras com a quantidade total de alunos por UF.
- O gráfico é atualizado automaticamente sempre que uma instituição é adicionada, editada ou removida.
- O gráfico está ordenado de forma decrescente por quantidade de alunos.

## Rotas da API

### Instituições
- `GET /instituicoes`: Lista todas as instituições.
- `POST /instituicoes`: Cria uma nova instituição.
- `PUT /instituicoes/:id`: Atualiza uma instituição existente.
- `DELETE /instituicoes/:id`: Deleta uma instituição.
- `GET /instituicoes/aggregated`: Obtém dados agregados para o gráfico de quantidade de alunos por UF.

### Verificação de Saúde
- `GET /healthy`: Verifica se a API está funcionando.
