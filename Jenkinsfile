pipeline {
  agent any

  tools {
    nodejs 'Node20'
  }

  options {
    timestamps()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build (Docker)') {
      steps {
        bat 'docker build -t bookstore-api:%BUILD_NUMBER% .'
      }
    }

    stage('Test (Jest)') {
      steps {
        bat 'npm ci'
        bat 'npm test'
      }
      post {
        always {
          archiveArtifacts artifacts: 'coverage/**', onlyIfSuccessful: false
        }
      }
    }

    stage('Deploy (Staging)') {
      steps {
        bat 'docker run -d --rm -p 3000:3000 --name bookstore-staging bookstore-api:%BUILD_NUMBER%'
        bat 'curl -f http://localhost:3000/health'
      }
      post {
        always {
          bat 'docker stop bookstore-staging || ver > nul'
        }
      }
    }
  }

  post {
    success { echo 'Pipeline OK' }
    failure { echo 'Pipeline FAILED' }
  }
}
