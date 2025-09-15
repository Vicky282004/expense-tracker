pipeline {
    agent any

    environment {
        APP_IMAGE = "expense-tracker:latest"
        COMPOSE_FILE = "docker-compose.yaml"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build JAR') {
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
                sh "docker-compose -f ${COMPOSE_FILE} up -d --build"
            }
        }

        stage('Wait for DB & App') {
            steps {
                // Give DB time to initialize fully
                sh "sleep 20"
                // Health check on app
                sh "curl -f http://localhost:8080 || exit 1"
            }
        }
    }

    post {
        always {
            echo "Stopping and cleaning containers..."
            sh "docker-compose -f ${COMPOSE_FILE} down -v"
        }
    }
}
