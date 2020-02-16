import { desc, run, sh, task } from "../mod.ts";

desc("Actionless task with prerequisites");
task("prereqs", ["noop", "pause"]);

desc("Synchronous task that does nothing");
task("noop", ["pause"], function() {
  console.log(this.desc);
});

desc("Execute shell command");
task("shell", [], async function() {
  await sh("echo Hello World");
});

desc("Execute multiple shell commands sequentially");
task("sequential", [], async function() {
  await sh("echo Hello World");
  await sh("ls");
  await sh("wc Drakefile.ts");
});

desc("Execute multiple shell commands concurrently");
task("concurrent", [], async function() {
  await sh(["echo Hello World", "ls", "wc Drakefile.ts"]);
});

desc("Execute bash shell script");
task("script", [], async function() {
  await sh(`set -e  # Exit immediately on error.
      echo Hello World
      if [ "$EUID" -eq 0 ]; then
          echo "Running as root"
      else
          echo "Running as $USER"
      fi
      ls
      wc Drakefile.ts`);
});

desc("Asynchronous task pauses for 1 second");
task("pause", [], async function() {
  await new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
});

desc("File task");
task("/tmp/file1", ["shell", "/tmp/file2"], function() {
  console.log(this.desc);
});

desc("Execute shell command");
task("shell2", ["shell"], async function() {
  await sh("echo Hello World 2");
});

await run();
