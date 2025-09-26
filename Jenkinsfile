pipeline {
  agent any
   
    stage('Build (Docker)') {
    steps {
        bat 'docker build -t bookstore-api:%BUILD_NUMBER% .'
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
    bat 'docker stop bookstore-staging || ver > nul'
    bat 'docker run -d --rm -p 3001:3000 --name bookstore-staging bookstore-api:%BUILD_NUMBER%'
    bat 'curl -f http://localhost:3001/health'
  }
  post {
    always {
      bat 'docker stop bookstore-staging || ver > nul'
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
