local name = "syncloud.org";
local node = "20-bookworm-slim";
local deploy_image = "debian:bookworm-slim";
local version = "${DRONE_BUILD_NUMBER}";

[{
    kind: "pipeline",
    name: name,
    platform: {
        os: "linux",
        arch: "amd64"
    },
    steps: [
        {
            name: "build web",
            image: "node:" + node,
            commands: [
                "bash web/build.sh"
            ]
        },
        {
            name: "deploy uat",
            image: deploy_image,
            environment: {
                DEPLOY_HOST: { from_secret: "uat_deploy_host" },
                DEPLOY_USER: { from_secret: "uat_deploy_user" },
                DEPLOY_KEY: { from_secret: "uat_deploy_key" },
                DEPLOY_URL: { from_secret: "uat_deploy_url" }
            },
            commands: [
                "./ci/deploy-prepare.sh uat",
                "./ci/deploy-run.sh uat " + version,
                "./ci/deploy-verify.sh"
            ],
            when: { event: ["push"] }
        },
        {
            name: "deploy prod",
            image: deploy_image,
            environment: {
                DEPLOY_HOST: { from_secret: "prod_deploy_host" },
                DEPLOY_USER: { from_secret: "prod_deploy_user" },
                DEPLOY_KEY: { from_secret: "prod_deploy_key" },
                DEPLOY_URL: { from_secret: "prod_deploy_url" }
            },
            commands: [
                "./ci/deploy-prepare.sh prod",
                "./ci/deploy-run.sh prod " + version,
                "./ci/deploy-verify.sh"
            ],
            when: { event: ["push"], branch: ["stable"] }
        }
    ]
}]
