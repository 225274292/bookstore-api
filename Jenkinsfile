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
        // stop any previous container using our name (ignore errors)
        bat 'docker stop bookstore-staging || ver > nul'
        // run on host port 3001 -> container 3000
        bat 'docker run -d --rm -p 3001:3000 --name bookstore-staging bookstore-api:%BUILD_NUMBER%'
        // smoke test on port 3001
        bat 'curl -f http://localhost:3001/health'
      }
      post {
        always {
          bat 'docker stop bookstore-staging || ver > nul'
        }
      }
    }

  post {
    success { echo 'Pipeline OK' }
    failure { echo 'Pipeline FAILED' }
  }
}
