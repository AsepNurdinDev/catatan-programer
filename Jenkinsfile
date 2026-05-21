pipeline {
    agent any

    environment {
        SERVER_USER = 'asepnrdn'
        SERVER_HOST = '172.17.0.1'
        PROJECT_DIR = '/home/asepnrdn/projects/personals/go-react'
    }

    stages {
        stage('Notify Start') {
            steps {
                echo 'Pipeline CI/CD dimulai...'
            }
        }

        stage('Pull Latest Code') {
            steps {
                sshagent(['server-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST} '
                            cd ${PROJECT_DIR} &&
                            git pull origin main
                        '
                    """
                }
            }
        }

        stage('Build & Deploy Docker') {
            steps {
                sshagent(['server-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST} '
                            cd ${PROJECT_DIR} &&
                            docker compose down &&
                            docker compose up -d --build
                        '
                    """
                }
            }
        }

        stage('Verify') {
            steps {
                sshagent(['server-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST} '
                            docker ps
                        '
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Deploy berhasil!'
        }
        failure {
            echo 'Deploy gagal! Cek log di atas.'
        }
    }
}