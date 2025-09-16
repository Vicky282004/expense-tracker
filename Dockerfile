# === Stage 1: Build with Maven and JDK 24 ===
FROM maven:3.9.9-eclipse-temurin-24 AS builder
WORKDIR /workspace

# Copy pom and source code
COPY pom.xml .
COPY src ./src

# Build the project
RUN mvn -B -DskipTests package

# === Stage 2: Run with JDK 24 runtime ===
FROM eclipse-temurin:24-jdk
WORKDIR /app

# Copy the built JAR from builder
COPY --from=builder /workspace/target/*.jar app.jar

# Copy updated application.properties into /app
COPY src/main/resources/application.properties application.properties

# Expose the port your app runs on
EXPOSE 8080

# Run the app
ENTRYPOINT ["java","-jar","app.jar"]

