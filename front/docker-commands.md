# 🐳 Comandos Básicos do Docker

## **Containers**

### Listar e Visualizar
```bash
# Listar containers rodando
docker ps

# Listar todos os containers (incluindo parados)
docker ps -a

# Listar containers com formato personalizado
docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
```

### Executar e Gerenciar
```bash
# Executar um container
docker run <imagem>

# Executar container em background
docker run -d <imagem>

# Executar container com nome específico
docker run --name <nome> <imagem>

# Executar container com portas mapeadas
docker run -p <porta_host>:<porta_container> <imagem>

# Executar container com variáveis de ambiente
docker run -e <VARIAVEL>=<valor> <imagem>
```

### Controle de Estado
```bash
# Parar um container
docker stop <container_id/name>

# Iniciar um container parado
docker start <container_id/name>

# Reiniciar um container
docker restart <container_id/name>

# Pausar um container
docker pause <container_id/name>

# Despausar um container
docker unpause <container_id/name>
```

### Remoção e Limpeza
```bash
# Remover um container
docker rm <container_id/name>

# Remover container forçadamente
docker rm -f <container_id/name>

# Remover todos os containers parados
docker container prune

# Remover todos os containers
docker rm $(docker ps -aq)
```

### Interação
```bash
# Executar comando em container rodando
docker exec -it <container_id/name> <comando>

# Acessar shell do container
docker exec -it <container_id/name> /bin/bash

# Acessar shell do container (alternativa)
docker exec -it <container_id/name> sh
```

## **Imagens**

### Listar e Visualizar
```bash
# Listar imagens
docker images

# Listar imagens com formato personalizado
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

### Download e Upload
```bash
# Baixar imagem do Docker Hub
docker pull <imagem>

# Baixar versão específica
docker pull <imagem>:<tag>

# Fazer push de imagem para Docker Hub
docker push <imagem>
```

### Construção
```bash
# Construir imagem de um Dockerfile
docker build -t <nome> .

# Construir com tag específica
docker build -t <nome>:<tag> .

# Construir sem cache
docker build --no-cache -t <nome> .
```

### Remoção
```bash
# Remover imagem
docker rmi <imagem>

# Remover imagem forçadamente
docker rmi -f <imagem>

# Remover imagens não utilizadas
docker image prune

# Remover todas as imagens
docker rmi $(docker images -q)
```

## **Sistema e Monitoramento**

### Recursos e Estatísticas
```bash
# Ver uso de recursos em tempo real
docker stats

# Ver uso de recursos de container específico
docker stats <container_id/name>

# Ver informações do sistema Docker
docker system df

# Ver informações detalhadas do sistema
docker system info
```

### Limpeza e Manutenção
```bash
# Limpar containers parados, redes não usadas
docker system prune

# Limpar TUDO (containers, imagens, volumes, redes)
docker system prune -a --volumes

# Limpeza forçada (sem confirmação)
docker system prune -a --volumes -f

# Verificar espaço usado
docker system df
```

## **Logs e Debug**

### Visualização de Logs
```bash
# Ver logs de um container
docker logs <container_id/name>

# Ver logs em tempo real
docker logs -f <container_id/name>

# Ver últimas N linhas
docker logs --tail <numero> <container_id/name>

# Ver logs com timestamp
docker logs -t <container_id/name>
```

### Inspeção e Debug
```bash
# Ver informações detalhadas de um container
docker inspect <container_id/name>

# Ver informações de uma imagem
docker inspect <imagem>

# Ver histórico de uma imagem
docker history <imagem>

# Ver processos rodando em um container
docker top <container_id/name>
```

## **Redes**

### Gerenciamento de Redes
```bash
# Listar redes
docker network ls

# Criar rede
docker network create <nome>

# Criar rede com driver específico
docker network create --driver bridge <nome>

# Conectar container a uma rede
docker network connect <rede> <container>

# Desconectar container de uma rede
docker network disconnect <rede> <container>

# Remover rede
docker network rm <rede>

# Ver detalhes de uma rede
docker network inspect <rede>
```

## **Volumes**

### Gerenciamento de Volumes
```bash
# Listar volumes
docker volume ls

# Criar volume
docker volume create <nome>

# Remover volume
docker volume rm <nome>

# Ver detalhes de um volume
docker volume inspect <nome>

# Remover volumes não utilizados
docker volume prune
```

## **Comandos Compostos Úteis**

### Limpeza Completa
```bash
# Parar todos os containers
docker stop $(docker ps -q)

# Remover todos os containers
docker rm $(docker ps -aq)

# Remover todas as imagens
docker rmi $(docker images -q)

# Limpeza completa do sistema
docker system prune -a --volumes -f
```

### Execução com Opções Comuns
```bash
# Executar container com nome, porta e volume
docker run -d \
  --name <nome> \
  -p <porta_host>:<porta_container> \
  -v <volume_host>:<volume_container> \
  <imagem>

# Executar container com rede específica
docker run -d \
  --name <nome> \
  --network <rede> \
  <imagem>
```

## **Dicas Importantes**

- Use `docker ps -a` para ver todos os containers
- Use `docker system prune` regularmente para limpar recursos não utilizados
- Use `docker logs -f` para acompanhar logs em tempo real
- Use `docker exec -it` para interagir com containers rodando
- Use `docker inspect` para ver detalhes de containers e imagens

## **Exemplos Práticos**

```bash
# Parar todos os containers de um projeto
docker stop investpro-account-api investpro-frontend

# Remover imagens de um projeto específico
docker rmi investment-page-account-api investment-page-frontend

# Limpar tudo relacionado ao Supabase
docker stop $(docker ps -q --filter "name=supabase")
docker rm $(docker ps -aq --filter "name=supabase")
docker rmi $(docker images -q --filter "reference=supabase/*")
```

---

*Documentação criada para referência rápida dos comandos Docker mais utilizados* 🐳
