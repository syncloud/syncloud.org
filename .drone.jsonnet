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
            name: "build grafana-deploy",
            image: "golang:" + golang,
            commands: [
                "cd grafana-deploy",
                "go vet ./...",
                "go test ./...",
                "CGO_ENABLED=0 go build -o ../ci/bin/grafana-deploy ."
            ]
        },
        {
            name: "deploy test",
            image: "debian:bookworm-slim",
            environment: {
                DEPLOY_HOST: test_host,
                DEPLOY_USER: "root",
                DEPLOY_URL: "http://" + test_host,
                GRAFANA_HOST: "127.0.0.1:3000",
                GRAFANA_PASSWORD: "test",
                ACCOUNT_URL: "https://www.syncloud.test",
            },
            commands: [
                "./ci/test-init.sh",
                "./ci/test-setup.sh",
                "./ci/deploy-prepare.sh",
                "./ci/deploy-run.sh " + version,
                "./ci/deploy-verify.sh",
                "./ci/deploy-grafana.sh",
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
                "bash web/install.sh",
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
                DEPLOY_URL: { from_secret: "uat_deploy_url" },
                GRAFANA_HOST: "127.0.0.1:3000",
                ACCOUNT_URL: "https://www.syncloud.info"
            },
            commands: [
                "./ci/deploy-key.sh",
                "./ci/deploy-prepare.sh",
                "./ci/deploy-run.sh " + version,
                "./ci/deploy-verify.sh",
                "./ci/deploy-grafana.sh"
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
                DEPLOY_URL: { from_secret: "prod_deploy_url" },
                ACCOUNT_URL: "https://www.syncloud.it"
            },
            commands: [
                "./ci/deploy-key.sh",
                "./ci/deploy-prepare.sh",
                "./ci/deploy-run.sh " + version,
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
