import { execSync } from "child_process";

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

try {
  run("npx hardhat compile");
  run("npx hardhat deploy || true");

  run("cd subgraph && npx graph codegen");
  run("cd subgraph && npx graph build");
  run("cd subgraph && npx graph deploy facinations -l v0.0.1");

  run("cd frontend && npm run build");
  run("cd frontend && npx vercel --prod");

  console.log("\n✅ Facinations full redeploy complete");
} catch (err) {
  console.error("\n❌ Redeploy failed");
  process.exit(1);
}
