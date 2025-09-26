pipeline {
  agent any

  tools {
    nodejs 'Node20'   // Jenkins -> Manage Jenkins -> Tools -> NodeJS installations
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

    stage('Test (Jest + Coverage)') {
      steps {
        // Install deps for tests, then produce coverage folder
        bat 'npm ci'
        bat 'npx jest --coverage --coverageReporters=lcov'
      }
      post {
        always {
          // Archive coverage even if tests fail (for debugging)
          archiveArtifacts artifacts: 'coverage/**', onlyIfSuccessful: false
        }
      }
    }

    stage('Deploy (Staging)') {
      steps {
        // Run the freshly built image and smoke test /health
        bat 'docker run -d --rm -p 3000:3000 --name bookstore-staging bookstore-api:%BUILD_NUMBER%'
        bat 'curl -f http://localhost:3000/health'
      }
      post {
        always {
          // Ensure staging container is stopped even if curl fails
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
