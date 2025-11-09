import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const git = simpleGit();
const path = "./data.json";

// ⚙️ Replace with your actual GitHub info
const GITHUB_NAME = "smec-rnd";
const GITHUB_EMAIL = "smecrtd@gmail.com";

async function makeCommits() {
  const startOfYear = moment("2025-01-01");
  const endOfYear = moment("2025-12-31");
  const failedCommits = [];

  for (
    let date = startOfYear.clone();
    date.isSameOrBefore(endOfYear);
    date.add(1, "day")
  ) {
    const formattedDate = date.format();
    const randomCommits = Math.floor(Math.random() * 10) + 1; // 🌀 random 1–10 commits

    for (let i = 1; i <= randomCommits; i++) {
      try {
        const data = { date: formattedDate, commit: i };
        await jsonfile.writeFile(path, data);

        await git.add(path);

        // ✍️ Commit with random author date
        await git.commit(`Random commit ${i}/${randomCommits} on ${formattedDate}`, {
          "--date": formattedDate,
          "--author": `${GITHUB_NAME} <${GITHUB_EMAIL}>`,
        });

        console.log(`✅ ${i}/${randomCommits} commits done for ${formattedDate}`);
      } catch (err) {
        console.error(`❌ Failed ${i}/${randomCommits} for ${formattedDate}:`, err.message);
        failedCommits.push({ date: formattedDate, commit: i, error: err.message });
      }
    }
  }

  try {
    await git.push("origin", "main");
    console.log("🚀 All commits pushed successfully!");
  } catch (err) {
    console.error("❌ Failed to push commits:", err.message);
    failedCommits.push({ date: "Push", commit: "N/A", error: err.message });
  }

  if (failedCommits.length > 0) {
    console.log("\n⚠️ Some commits failed:");
    console.table(failedCommits);
  } else {
    console.log("\n✅ All commits completed successfully!");
  }
}

makeCommits();
