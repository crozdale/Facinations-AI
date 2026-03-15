import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const root = process.cwd();
const network = "sepolia";

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

/* 1️⃣ Compile */
run("npx hardhat compile");

/* 2️⃣ Deploy contracts */
run(`npx hardhat deploy --network ${network}`);

/* 3️⃣ Read deployment addresses */
const deployFile = path.join(root, "deployments", `${network}.json`);
if (!fs.existsSync(deployFile)) {
  throw new Error("Missing deployments file");
}

const deployments = JSON.parse(fs.readFileSync(deployFile));
const registry = deployments.VaultRegistry.address;
const premium = deployments.XERPremiumGate.address;

/* 4️⃣ Run fix pipeline (ABIs + subgraph.yaml) */
run("npm run facinations:fix");

/* 5️⃣ Inject contract addresses into subgraph.yaml */
const subgraphPath = path.join(root, "subgraph/subgraph.yaml");
let yaml = fs.readFileSync(subgraphPath, "utf8");

yaml = yaml
  .replace("0xYOUR_REGISTRY_ADDRESS", registry)
  .replace("0xYOUR_PREMIUM_GATE_ADDRESS", premium);

fs.writeFileSync(subgraphPath, yaml);

/* 6️⃣ Graph codegen + deploy */
run("cd subgraph && npx graph codegen");
run("cd subgraph && npx graph deploy facinations");

/* 7️⃣ Inject frontend env */
const envProd = `
VITE_VAULT_REGISTRY=${registry}
VITE_XER_PREMIUM_GATE=${premium}
VITE_SUBGRAPH_URL=https://api.studio.thegraph.com/query/YOUR_ID/facinations
`.trim();

fs.writeFileSync(
  path.join(root, "frontend/.env.production"),
  envProd
);

/* 8️⃣ Vercel deploy */
run("cd frontend && npx vercel --prod");

console.log("\n✅ FULL FACINATIONS REDEPLOY COMPLETE");
