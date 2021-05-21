const { run } = require("./handler");

(async function () {
  await run("event", { functionName: "aws-lambda-sg-ce-cron-job" });
})();
