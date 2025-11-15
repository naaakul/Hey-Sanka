pipeline {
    agent any

    environment {
        VM_USER = "nakul"
        VM_HOST = "136.112.121.180"
        VM_PATH = "/Hey-Sanka"
        SSH_KEY = "vm-ssh-key"
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

        stage('Upload Build to VM') {
            steps {
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: 'vm-server',
                            transfers: [
                                sshTransfer(
                                    sourceFiles: '.next/**, public/**, package.json, package-lock.json',
                                    remoteDirectory: "${VM_PATH}",
                                    removePrefix: ''
                                )
                            ],
                            usePromotionTimestamp: false,
                            verbose: true
                        )
                    ]
                )
            }
        }

        stage('Restart PM2') {
            steps {
                sh """
                ssh -i /var/lib/jenkins/.ssh/id_rsa ${VM_USER}@${VM_HOST} \
                'cd ${VM_PATH} && pm2 restart next-app || pm2 start npm --name next-app -- start'
                """
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
