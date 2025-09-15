pipeline {
    agent any

    environment {
        APP_IMAGE   = "expense-tracker:latest"
        COMPOSE_FILE = "docker-compose.yaml"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build JAR') {
            agent {
                docker {
                    image 'maven:3.9.9-eclipse-temurin-24'
                    args '-v $HOME/.m2:/root/.m2'
                }
            }
            steps {
                sh 'mvn -B -DskipTests clean package'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${APP_IMAGE} ."
            }
        }

        stage('Start Services') {
            steps {
                // Use docker compose (plugin syntax), works with new Docker
                sh "docker compose -f ${COMPOSE_FILE} up -d --build"
            }
        }

        stage('Wait for DB & App') {
            steps {
                echo "Waiting for DB & App..."
                sh "sleep 25"
                sh "curl -f http://localhost:8080/actuator/health || exit 1"
            }
        }
    }

    post {
        always {
            echo "Stopping and cleaning containers..."
            sh "docker compose -f ${COMPOSE_FILE} down -v || true"
        }
    }
}
