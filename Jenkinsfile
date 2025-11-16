pipeline {
    agent any

    environment {
        VM_USER = "nakul"
        VM_HOST = "136.112.121.180"
        VM_PATH = "/Hey-Sanka"
        // SSH_KEY = "vm-ssh-key"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/naaakul/Hey-Sanka.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Next App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Upload Files to VM') {
            steps {
                script {
                    sshagent(credentials: ['vm-ssh-key']) {
                        sh """
                        rsync -avz --delete \
                            --exclude='.git' \
                            --exclude='node_modules' \
                            ./ ${VM_USER}@${VM_HOST}:${VM_PATH}
                        """
                    }
                }
            }
        }

        stage('Restart PM2 on Server') {
            steps {
                script {
                    sshagent(credentials: ['vm-ssh-key']) {
                        sh """
                        ssh ${VM_USER}@${VM_HOST} "
                            cd ${VM_PATH} &&
                            pm2 restart next-app || pm2 start npm --name next-app -- start
                        "
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Deployment Successful"
        }
        failure {
            echo "Deployment Failed"
        }
    }
}
