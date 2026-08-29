local name = "syncloud.org";
local node = "20-bookworm-slim";
local golang = "1.25-bookworm";
local playwright = "v1.59.1-jammy";
local bootstrap = "syncloud/bootstrap-bookworm-amd64:26.04.2";
local test_host = "site.syncloud.test";
local deploy_image = "debian:bookworm-slim";
local version = "${DRONE_BUILD_NUMBER}";

[{
    kind: "pipeline",
    name: name,
    trigger: {
        event: ["push"]
    },
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
            name: "build backend",
            image: "golang:" + golang,
            commands: [
                "cd backend",
                "go vet ./...",
                "go test ./...",
                "CGO_ENABLED=0 go build -o bin/api ./cmd/api"
            ]
        },
        {
            name: "build github-faker",
            image: "golang:" + golang,
            commands: [
                "cd github-faker",
                "CGO_ENABLED=0 go build -o ../ci/sim/github-faker ."
            ]
        },
        {
            name: "deploy test",
            image: "debian:bookworm-slim",
            environment: {
                DEPLOY_HOST: test_host,
                DEPLOY_USER: "root",
                DEPLOY_URL: "http://" + test_host,
                SITE_DOMAIN: "http://" + test_host,
            },
            commands: [
                "./ci/test-init.sh",
                "./ci/test-setup.sh",
                "./ci/deploy-prepare.sh test",
                "./ci/deploy-run.sh test " + version,
                "./ci/deploy-verify.sh",
            ]
        },
        {
            name: "test-ui-desktop",
            image: "mcr.microsoft.com/playwright:" + playwright,
            environment: {
                CI: "true",
                PLAYWRIGHT_BASE_URL: "http://" + test_host,
            },
            commands: [
                "cd web && npm ci && cd ..",
                "./ci/e2e.sh desktop"
            ]
        },
        {
            name: "test-ui-mobile",
            image: "mcr.microsoft.com/playwright:" + playwright,
            environment: {
                CI: "true",
                PLAYWRIGHT_BASE_URL: "http://" + test_host,
            },
            commands: [
                "./ci/e2e.sh mobile"
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
    ],
    services: [
        {
            name: test_host,
            image: bootstrap,
            privileged: true,
            volumes: [
                { name: "dbus", path: "/var/run/dbus" },
                { name: "dev", path: "/dev" }
            ]
        }
    ],
    volumes: [
        { name: "dbus", host: { path: "/var/run/dbus" } },
        { name: "dev", host: { path: "/dev" } }
    ]
}]
