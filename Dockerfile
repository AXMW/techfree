# Use a multi-stage build for smaller final image
# Etapa de build
FROM eclipse-temurin:21-jdk-alpine as builder
WORKDIR /app

# Instala bash, curl e dos2unix
RUN apk add --no-cache bash curl dos2unix

# Copia arquivos do Maven Wrapper e projeto
COPY .mvn/wrapper .mvn/wrapper
COPY mvnw pom.xml ./
COPY src ./src

# Garante permissão e formato correto do mvnw
RUN dos2unix mvnw && chmod +x mvnw

RUN ./mvnw clean package -DskipTests

# Etapa de execução
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]

