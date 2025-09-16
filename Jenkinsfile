pipeline {
    agent any

    environment {
        APP_IMAGE    = "expense-tracker:latest"
        COMPOSE_FILE = "docker-compose.yaml"
    }

    stages {
        stage('Checkout') {
            steps {
                // This will be the only checkout
                git branch: 'main', url: 'https://github.com/Vicky282004/expense-tracker.git'
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
                sh "docker-compose -f ${env.COMPOSE_FILE} up -d --build"
            }
        }

        stage('Wait for DB & App') {
            steps {
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
            sh "docker-compose -f ${env.COMPOSE_FILE} down -v || true"
        }
    }
}
