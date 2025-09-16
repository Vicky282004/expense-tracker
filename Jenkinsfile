pipeline {
    agent any

    environment {
        APP_IMAGE    = "expense-tracker:latest"
        COMPOSE_FILE = "docker-compose.yaml"
    }

    stages {
        stage('Checkout') {
            steps {
                deleteDir() // Clean workspace before checkout
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
                sh "docker-compose -f ${env.COMPOSE_FILE} up -d --build"
            }
        }

        stage('Wait for DB & App') {
            steps {
                echo "Waiting for DB & App to be ready..."
                script {
                    def retries = 12
                    def success = false
                    for (int i = 0; i < retries; i++) {
                        try {
                            sh "curl -f http://localhost:8080/actuator/health"
                            success = true
                            break
                        } catch (err) {
                            echo "Attempt ${i+1}/${retries} failed, retrying in 10s..."
                            sleep 10
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
            script {
                sh "docker-compose -f ${env.COMPOSE_FILE} down -v || true"
            }
        }
    }
}

