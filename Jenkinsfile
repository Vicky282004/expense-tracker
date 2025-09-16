pipeline {
    agent any

    options {
        // Prevent Jenkins from doing an automatic SCM checkout at the start
        skipDefaultCheckout()
    }

    environment {
        APP_IMAGE    = "expense-tracker:latest"
        COMPOSE_FILE = "docker-compose.yaml"
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

        stage('Start Services') {
            steps {
                sh "docker-compose -f ${COMPOSE_FILE} up -d --build"
            }
        }

        stage('Wait for App') {
            steps {
                echo "Waiting for the app to be healthy..."
                script {
                    def retries = 10
                    def success = false
                    for (int i = 0; i < retries; i++) {
                        try {
                            sh "curl -f http://localhost:8080/actuator/health"
                            success = true
                            break
                        } catch (err) {
                            echo "Attempt ${i+1}/${retries} failed, retrying in 5s..."
                            sleep 5
                        }
                    }
                    if (!success) {
                        error "App did not become healthy in time!"
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning up Docker resources..."

            // Stop any containers attached to this network
            sh '''
                docker ps -q --filter "network=expensetracker_my-network" | xargs -r docker rm -f
            '''

            // Stop and remove services + volumes
            sh "docker-compose -f ${COMPOSE_FILE} down -v || true"

            // Remove the leftover network if it still exists
            sh "docker network rm expensetracker_my-network || true"
        }
    }
}


