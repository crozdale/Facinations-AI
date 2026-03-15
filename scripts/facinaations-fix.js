import { execSync } from "child_process";

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

try {
  run("npm install");
  run("npx hardhat clean");
  run("npx hardhat compile");

  console.log("\n✅ Facinations environment fixed");
} catch (err) {
  console.error("\n❌ Fix failed");
  process.exit(1);
}
