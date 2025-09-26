pipeline {
  agent any

  stages {
    stage('Build (Docker)') {
      steps {
        bat 'docker build -t bookstore-api:${BUILD_NUMBER} .'
      }
    }

    stage('Test (Jest + Coverage)') {
      steps {
        bat 'npm ci'
        bat 'npx jest --coverage --coverageReporters=lcov'
      }
      post {
        always {
          archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
        }
      }
    }

    stage('Deploy (Staging)') {
      steps {
        // stop any previous container if exists
        bat 'docker stop bookstore-staging || ver > nul'
        // run on port 3001
        bat 'docker run -d --rm -p 3001:3000 --name bookstore-staging bookstore-api:%BUILD_NUMBER%'
        // quick smoke test
        bat 'curl -f http://localhost:3001/health'
      }
      post {
        always {
          bat 'docker stop bookstore-staging || ver > nul'
        }
      }
    }
  }

  post {
    success {
      echo 'Pipeline SUCCESS'
    }
    failure {
      echo 'Pipeline FAILED'
    }
  }
}
