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
    stage('Lint (ESLint)') {
      steps {
        bat 'npm ci'
        bat 'npx eslint .'
      }
    }


    stage('Build (Docker)') {
      steps {
        bat 'docker build -t bookstore-api:%BUILD_NUMBER% .'
      }
    }

      stage('Test (Jest + Coverage)') {
      steps {
        bat 'npx jest --coverage --coverageReporters=lcov'
      }
      post {
        always {
          archiveArtifacts artifacts: 'coverage/**', onlyIfSuccessful: false, allowEmptyArchive: true
        }
      }
    }

    stage('Deploy (Staging)') {
      steps {
        // stop any previous container (ignore errors)
        bat 'docker stop bookstore-staging || ver > nul'

        // run staging on host port 3001 -> container port 3000
        bat 'docker run -d --rm -p 3001:3000 --name bookstore-staging bookstore-api:%BUILD_NUMBER%'

        // wait a moment, then retry health check up to 10 times
        bat '''
          timeout /T 2 /NOBREAK >nul
          for /L %%i in (1,1,10) do (
            curl -sf http://localhost:3001/health && goto :ok
            echo Health not ready yet (attempt %%i/10) & timeout /T 2 /NOBREAK >nul
          )
          echo Health check failed after retries & exit /b 1
          :ok
        '''
      }
      post {
        always {
          bat 'docker stop bookstore-staging || ver > nul'
        }
      }
    }
  }

  post {
    success { echo 'Pipeline SUCCESS' }
    failure { echo 'Pipeline FAILED' }
  }
}
