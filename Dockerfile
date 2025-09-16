# === Stage 1: Build with Maven and JDK 24 ===
FROM maven:3.9.9-eclipse-temurin-24 AS builder
WORKDIR /workspace
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests package

# === Stage 2: Run with JDK 24 runtime ===
FROM eclipse-temurin:24-jdk
WORKDIR /app
COPY --from=builder /workspace/target/*.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]
