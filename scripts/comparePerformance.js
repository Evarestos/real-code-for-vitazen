const fs = require('fs');

function comparePerformance(beforeFile, afterFile) {
  const beforeData = JSON.parse(fs.readFileSync(beforeFile, 'utf8'));
  const afterData = JSON.parse(fs.readFileSync(afterFile, 'utf8'));

  console.log('Performance Comparison:');
  console.log('------------------------');
  console.log(`Avg Request Duration: ${((afterData.metrics.http_req_duration.avg - beforeData.metrics.http_req_duration.avg) / beforeData.metrics.http_req_duration.avg * 100).toFixed(2)}% change`);
  console.log(`95th Percentile Duration: ${((afterData.metrics.http_req_duration['p(95)'] - beforeData.metrics.http_req_duration['p(95)']) / beforeData.metrics.http_req_duration['p(95)'] * 100).toFixed(2)}% change`);
  console.log(`Requests per second: ${((afterData.metrics.http_reqs.rate - beforeData.metrics.http_reqs.rate) / beforeData.metrics.http_reqs.rate * 100).toFixed(2)}% change`);
}

comparePerformance('before_performance.json', 'after_performance.json');
