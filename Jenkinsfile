#!groovy

@Library('mercadonaonline')
import org.mercadonaonline.SlackNotifications
import org.mercadonaonline.StatusTesters
import org.mercadonaonline.Kubernetes
import org.mercadonaonline.Registry
import org.mercadonaonline.General
import org.mercadonaonline.Mercanetes

def slack = new SlackNotifications(this)
def tester = new StatusTesters(this)
def k8s = new Kubernetes(this)
def registry = new Registry(this)
def general = new General(this)
def mercanetes = new Mercanetes(this)

node {
    general.checkoutWithTags()
}

pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '30', artifactNumToKeepStr: '1'))
    }

    environment {
        DOCKER_IMAGE_NAME = "permission-panel-nginx"
        BUILD_WORKSPACE = "${env.WORKSPACE.replace(env.JENKINS_JOBS, '/var/jenkins_home/jobs')}"
        DOCKER_CONTEXT_WORKSPACE = "$BUILD_ID"+"${env.BRANCH_NAME.replace('/','').replace('_','').replace('-','').toLowerCase()}"+"_${DOCKER_IMAGE_NAME}"
        DOCKER_BUILD_NETWORK = "$BUILD_ID"+"${env.BRANCH_NAME.replace('/','').replace('_','').replace('-','').toLowerCase()}"+"_${DOCKER_IMAGE_NAME}"
        NODE_IMAGE = "eu.gcr.io/prod-mercadona/node:18.17.1-0.0.2"
        DOCKER_NAMESPACE = "eu.gcr.io/prod-mercadona"
    }

    stages {

        stage ('Preparations') {
            steps {
                script {
                    slack.initializeGitVariables()
                    app_ui = null
                    isProduction = env.TAG_NAME != null
                    isStaging = env.BRANCH_NAME == 'master'
                    isPR = env.CHANGE_BRANCH != null
                    env.GID = sh(returnStdout: true, script: 'id -g $USER').trim()
                    env.UID = sh(returnStdout: true, script: 'id -u $USER').trim()
                    sh 'env'
                }
            }
        }

        stage ('Security Check') {
            when {expression {(isProduction)}}
            steps {
                script {
                    error "You can not run a tag pipeline"
                }
            }
        }

        stage ('Install dependencies') {
            steps {
                script {
                    sh 'docker login -u _json_key -p "$(cat $HOME/.gcp/gcp.json)" https://eu.gcr.io'
                    sh 'docker run --rm -m=4g -v $JENKINS_JOBS:/var/jenkins_home/jobs -e CI=1 --workdir $BUILD_WORKSPACE --name $DOCKER_BUILD_NETWORK-install $NODE_IMAGE npm install --registry http://172.21.97.98'
                }
            }
        }

        stage ('Linting') {
            when {
                expression {
                    (isPR)
                }
            }
            steps {
                script {
                    sh """
                        docker run --rm -m=4g \
                            -v $JENKINS_JOBS:/var/jenkins_home/jobs \
                            -e NODE_ENV="jenkins" \
                            --workdir $BUILD_WORKSPACE \
                            --name $DOCKER_BUILD_NETWORK-build $NODE_IMAGE npm run lint
                    """
                }
            }
        }

        stage ('Typecheck') {
            when {
                expression {
                    (isPR)
                }
            }
            steps {
                script {
                    sh """
                        docker run --rm -m=4g \
                            -v $JENKINS_JOBS:/var/jenkins_home/jobs \
                            -e NODE_ENV="jenkins" \
                            -e CI=true \
                            --workdir $BUILD_WORKSPACE \
                            --name $DOCKER_BUILD_NETWORK-build $NODE_IMAGE npm run typecheck
                    """
                }
            }
        }

        stage ('Tests') {
            when {
                expression {
                    (isPR)
                }
            }
            steps {
                script {
                   sh 'docker run --rm -m=4g -v $JENKINS_JOBS:/var/jenkins_home/jobs -e NODE_ENV="jenkins" --workdir $BUILD_WORKSPACE --name $DOCKER_BUILD_NETWORK-build $NODE_IMAGE npm run test'
                }
            }
            post {
                always {
                    script {
                        // Required for archiving
                        general.restoreFilePermissions(env.BUILD_WORKSPACE, env.UID, env.GID)
                        general.setStatusFromTestResults()
                    }
                }
            }
        }

         stage ('Build sta') {
            steps {
                script {
                    env.NODE_IMAGE_VERSION = registry.getImageTag()

                    sh """
                        docker run \
                        --rm \
                        -m=4g \
                        -v $JENKINS_JOBS:/var/jenkins_home/jobs \
                        -e NODE_ENV='jenkins' \
                        -e CI=true \
                        -e NODE_IMAGE_VERSION=$NODE_IMAGE_VERSION \
                        --workdir $BUILD_WORKSPACE \
                        --name $DOCKER_BUILD_NETWORK-build $NODE_IMAGE \
                        npm run build:sta
                    """
                    app_ui = registry.build(env.DOCKER_IMAGE_NAME)
                }
            }
        }

        stage ('Publish registry sta image') {
            when { expression { (isStaging) } }
            steps {
                script {
                    imageTag = registry.getImageTag()
                    registry.push(app_ui, imageTag)
                }
            }
        }

        stage ('Publish release in metadata sta') {
            when {
                expression { (isStaging) }
            }
            steps {
                script {
                    appName = "permission-panel"
                    mercanetes.setMetadataEndpoint("staging")
                    mercanetes.release(appName, imageTag, 'stable')
                }
            }
            post {
                always {script {env.BUILD_END = sh(returnStdout: true, script: 'date +%s').trim()}}
                failure {script { slack.kubernetesNotifyFailure('staging', imageTag) }}
            }
        }

        stage('Generate tag for production') {
            when { expression { (isStaging) } }
            steps {
                withCredentials([gitUsernamePassword(credentialsId: 'hacendabot-user-token')]) {
                script {
                        checkout(
                            [
                                $class: 'GitSCM',
                                branches: [[name: '*/master']],
                                doGenerateSubmoduleConfigurations: false,
                                extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: 'scripts']],
                                submoduleCfg: [],
                                userRemoteConfigs: [[
                                    url: 'https://github.com/mercadona/mercadona.online.devtools.git',
                                    credentialsId:'hacendabot-user-token'
                                ]]
                            ]
                        )
                        production_tag = sh(returnStdout: true, script: "sh " + "scripts/create_tag_without_hash_continuos_deployment.sh").trim()
                    }
                }
            }
        }

        stage ('Build prod') {
            when { expression { (isStaging) } }
            steps {
                script {
                    env.NODE_IMAGE_VERSION = production_tag

                    sh """
                        docker run \
                        --rm \
                        -m=4g \
                        -v $JENKINS_JOBS:/var/jenkins_home/jobs \
                        -e NODE_ENV='jenkins' \
                        -e CI=true \
                        -e NODE_IMAGE_VERSION=$NODE_IMAGE_VERSION \
                        --workdir $BUILD_WORKSPACE \
                        --name $DOCKER_BUILD_NETWORK-build $NODE_IMAGE \
                        npm run build:prod
                    """
                    app_ui = registry.build(env.DOCKER_IMAGE_NAME, ".", production_tag)
                }
            }
        }

        stage('Changelog') {
            when { expression { (isStaging) } }
            steps {
                script {
                    withEnv(['PROJECT_NAME=mo.auth.permission-panel']) {
                        changelog = sh(
                            returnStdout: true,
                            script: "./devtools/generate_changelog_by_topic.sh"
                        ).trim()
                    }

                    general.sendReleaseToGithub(production_tag, changelog)
                }
            }
        }

        stage ('Publish registry prod image') {
            when { expression { (isStaging) } }
            steps {
                script {
                    echo "Tagging production image with tag: " + "${production_tag}"
                    registry.push(app_ui, production_tag)
                }
            }
        }

        stage ('Publish release in metadata prod') {
            when { expression { (isStaging) } }
            steps {
                script {
                    appName = "permission-panel"
                    mercanetes.setMetadataEndpoint("production")
                    mercanetes.release(appName, production_tag, 'stable')
                }
            }
            post {
                failure {script {slack.kubernetesNotifyFailure('production', production_tag)}}
            }
        }

        stage ('Docker Registry clean up') {
            steps {
                script {registry.cleanup(env.DOCKER_IMAGE_NAME, 90)}
            }
            post {
                failure {
                    script {slack.registryNotifyFailure(90)}
                }
            }
        }
    }

    post {
        failure {
            script {slack.finalNotify('#dx-events', tester.testStatuses())}
        }
        always {
            script {
                def removeImage = null
                if (app_ui != null) {
                    removeImage = app_ui.id
                }
                general.restoreFilePermissions(env.BUILD_WORKSPACE, env.UID, env.GID)
                general.cleanEnvironment(removeImage)
            }
        }
    }
}
