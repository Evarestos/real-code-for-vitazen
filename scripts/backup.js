const { exec } = require('child_process');
const config = require('../src/config');

const backupCommand = `mongodump --uri="${config.MONGODB_URI}" --out="./backups/$(date +%Y-%m-%d)"`;

exec(backupCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Σφάλμα: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`Το backup ολοκληρώθηκε επιτυχώς: ${stdout}`);
});
