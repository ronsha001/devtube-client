isRelease = false
isFeature = false
pipeline {
  agent any

  stages {
    stage ("Init") {
      steps {
        script {
          if (env.BRANCH_NAME =~ "^release/*") {
            isRelease = true
            echo "IS RELEASE"
          }
          if (env.BRANCH_NAME =~ "^feature/*") {
            isFeature = true
            echo "IS FEATURE"
          }
        }
      }
    }

    stage ("Version") {
      steps {
        script {
          if (isRelease) {
            echo "Start Version Stage"
            version = "${env.BRANCH_NAME}".split('/')[1]
            // Fetch all tags
            sh "git fetch --all --tags"
            // Print tags
            sh 'git tag'
            // Find latest tag and generate new one
            try {
              newTag = Integer.parseInt( sh(script: "git tag | grep ^${version} | sort --version-sort | tail -1 | cut -d '.' -f 3", returnStdout: true).trim() )
            } catch (Exception e) {
              newTag = null
            }
            if (newTag == null) {
              newTag = 0
            } else {
              newTag += 1
            }
            newVersion = "${version}.${newTag}"
            echo "~~~ New Version: ${newVersion} ~~~"
          }
          
        }
      }
    }
    stage ("Build") {
      steps {
        script {
          if (isRelease || isFeature) {
            echo "Start Build Stage"
            sh """
              docker build -t test-app .
              docker run --name test-client -p 3000:3000 -d test-app
            """
          }
        }
      }
    }
    stage ("Tests") {
      steps {
        script {
          echo "Start Tests Stage"
          if (isRelease || isFeature) {
            dir('tests') {
              sh "wget --tries=10 --waitretry=5 --retry-connrefused --retry-on-http-error=502 -O- http://localhost:3000"
              sh 'python3 test.py'
            }
          }
        }
      }
    }
    stage ("Publish") {
      steps {
        parallel (
          "publish" : {
            script {
              if (isRelease) {
                echo "Start Publish Stage"
                sh """
                  az login --identity
                  az acr login --name devtube
                  docker tag test-app devtube.azurecr.io/devtube-app:${newVersion}
                  docker push devtube.azurecr.io/devtube-app:${newVersion}
                """
              }
            }
          },
          "tag" : {
            script {
              if (isRelease) {
                sh "git checkout -b release/${version}"
                sh "git clean -f"
                sh "git tag ${newVersion}"
                sh "git push --tags"
              }
            }
          },
          "update-chart" : {
            script {
              if (isRelease) {
                sh "git clone git@github.com:ronsha001/devtube-chart.git"
                echo "Update chart with new app image tag: ${newVersion}"
                dir("devtube-chart/devtube") {
                  sh """
                    yq \'(.client.image_tag = \"${newVersion}\" )\' values.yaml | sponge values.yaml
                    git commit -am \"jenkins-app-update, version: ${newVersion}\"
                    git push origin master
                  """
                }
              }
            }
          }
        )
      }
    }
  }
  post {
    always {
      sh "docker rm -f test-client"
      script {
        if (isRelease) {
          sh "docker image rm devtube.azurecr.io/devtube-app:${newVersion}"
        }
      }
    }
  }
}