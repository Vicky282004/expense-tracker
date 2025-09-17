pipeline {
    agent any

    options {
        skipDefaultCheckout()
    }

    environment {
        APP_NAME     = "expense-tracker"
        APP_IMAGE    = "expense-tracker:latest"
        COMPOSE_FILE = "docker-compose.yaml"
        DOCKERHUB_USER = "vignesh282004"   // replace with your Docker Hub username
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Vicky282004/expense-tracker.git'
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

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker tag ${APP_IMAGE} $DOCKER_USER/${APP_NAME}:latest
                        docker push $DOCKER_USER/${APP_NAME}:latest
                    """
                }
            }
        }

        stage('Start Services') {
            steps {
                sh "docker-compose -f ${COMPOSE_FILE} up -d --build"
            }
        }
    }

    post {
        always {
            echo "Cleaning up Docker resources..."
            sh "docker-compose -f ${COMPOSE_FILE} down -v || true"
        }
    }
}

