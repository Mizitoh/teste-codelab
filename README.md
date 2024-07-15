# Teste CodeLab

API de produto e front em angular para o teste do VR Web
Front está incompleto.

## Development Start

Posicione-se na pasta "teste" onde estão o docker-compose e as pastas back e front.
Execute o comando:

```bash
docker compose up --build
```

## Execução de testes

Não foram feitos testes para o front.

Posicione-se na pasta do back e execute o seguinte comando:

```bash
docker compose -f docker-compose-test.yml up
```

Por algum motivo não consegui trazer esse compose para pasta raiz (teste)

- Atenção: "attach" ao container para executar os testes.
- Caso não deseje obter os relatórios de cobertura, remova o sufixo `:cov` dos comandos abaixo.

### Unit

```bash
npm run test:cov
```

### E2E

```bash
npm run test:e2e:cov
```
