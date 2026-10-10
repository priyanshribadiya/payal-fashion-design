import http from 'http';
import { reserveStock } from '../services/inventoryService.js';
import mongoose from 'mongoose';
import { ENV } from '../config/env.js';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';

/**
 * Perform a single HTTP GET request
 */
function makeRequest(url) {
  return new Promise(resolve => {
    const start = Date.now();
    http
      .get(url, res => {
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            duration: Date.now() - start,
            success: res.statusCode >= 200 && res.statusCode < 400,
          });
        });
      })
      .on('error', err => {
        resolve({
          statusCode: 0,
          duration: Date.now() - start,
          success: false,
          error: err.message,
        });
      });
  });
}

/**
 * Concurrency Test 1: High-throughput 500 concurrent requests simulation
 */
async function runConcurrencyThroughputTest(targetConcurrent = 500) {
  console.log(`\n==================================================`);
  console.log(` 🚀 STARTING 500 CONCURRENT USERS LOAD TEST`);
  console.log(` Target Concurrency: ${targetConcurrent} active requests`);
  console.log(` Target Server:      http://localhost:${ENV.PORT}`);
  console.log(`==================================================\n`);

  const urls = [
    `http://localhost:${ENV.PORT}/api/health`,
    `http://localhost:${ENV.PORT}/api/products?limit=12`,
    `http://localhost:${ENV.PORT}/api/categories`,
  ];

  const startTime = Date.now();
  const promises = [];

  for (let i = 0; i < targetConcurrent; i++) {
    const selectedUrl = urls[i % urls.length];
    promises.push(makeRequest(selectedUrl));
  }

  const results = await Promise.all(promises);
  const totalDuration = Date.now() - startTime;

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const durations = results.map(r => r.duration).sort((a, b) => a - b);

  const avgLatency = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
  const p50 = durations[Math.floor(durations.length * 0.5)];
  const p95 = durations[Math.floor(durations.length * 0.95)];
  const p99 = durations[Math.floor(durations.length * 0.99)];
  const rps = Math.round((results.length / (totalDuration / 1000)) * 10) / 10;

  console.log(`--- Load Test Results ---`);
  console.log(` Total Requests:     ${results.length}`);
  console.log(` Successful (2xx):   ${successful} (${Math.round((successful / results.length) * 100)}%)`);
  console.log(` Failed:             ${failed}`);
  console.log(` Total Time Elapsed: ${totalDuration} ms`);
  console.log(` Requests/Second:    ${rps} req/sec`);
  console.log(` Average Latency:    ${avgLatency} ms`);
  console.log(` 50th Percentile:    ${p50} ms`);
  console.log(` 95th Percentile:    ${p95} ms`);
  console.log(` 99th Percentile:    ${p99} ms`);
  console.log(`-------------------------\n`);

  return { successful, failed, p95, rps };
}

/**
 * Concurrency Test 2: Race-condition test for the last stock item
 * Simulates 10 concurrent customers attempting to reserve 1 remaining item at the exact same instant.
 */
async function runStockRaceConditionTest() {
  console.log(`--- Stock Race Condition Test (Preventing Overselling) ---`);
  try {
    await mongoose.connect(ENV.MONGODB_URI);

    // Create or find a test product with exactly 1 item in stock
    let testCat = await Category.findOne();
    if (!testCat) {
      testCat = await Category.create({ name: 'Test Cat', slug: 'test-cat' });
    }

    const testProduct = await Product.findOneAndUpdate(
      { sku: 'RACE-TEST-SKU-001' },
      {
        name: 'Limited Edition Silk Dupatta',
        slug: 'race-test-silk-dupatta',
        description: 'Test product for concurrency race condition',
        category: testCat._id,
        categoryName: testCat.name,
        images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c'],
        priceInPaise: 100000,
        sku: 'RACE-TEST-SKU-001',
        inventoryQuantity: 1, // Only ONE item available!
        isActive: true,
      },
      { upsert: true, new: true }
    );

    console.log(` Initial Available Stock for "${testProduct.name}": ${testProduct.inventoryQuantity}`);

    // Fire 10 simultaneous reserve requests
    const attempts = 10;
    console.log(` Simulating ${attempts} simultaneous purchase attempts for the 1 remaining item...`);

    const reservePromises = [];
    for (let i = 0; i < attempts; i++) {
      reservePromises.push(
        reserveStock([{ productId: testProduct._id.toString(), quantity: 1 }])
      );
    }

    const outcomes = await Promise.all(reservePromises);
    const successes = outcomes.filter(o => o.success).length;
    const rejections = outcomes.filter(o => !o.success).length;

    const finalProduct = await Product.findById(testProduct._id);

    console.log(` Successes Granted:  ${successes}`);
    console.log(` Rejections Handled: ${rejections}`);
    console.log(` Final Stock in DB:  ${finalProduct.inventoryQuantity}`);

    if (successes === 1 && finalProduct.inventoryQuantity === 0) {
      console.log(`\n ✔ VERIFIED: Atomic concurrency check succeeded! Exactly 1 order succeeded and 0 overselling occurred.\n`);
    } else {
      console.error(`\n ❌ CONCURRENCY DEFECT: Expected 1 success but got ${successes}!\n`);
    }

    // Clean up
    await Product.deleteOne({ _id: testProduct._id });
  } catch (error) {
    console.error(`[Race Test Error] ${error.message}`);
  } finally {
    await mongoose.disconnect();
  }
}

// Check execution
const isDirectRun = process.argv[1]?.includes('loadTest.js');
if (isDirectRun) {
  (async () => {
    // If backend is running, test throughput, then test DB race condition
    try {
      await runConcurrencyThroughputTest(500);
    } catch {
      console.log('[Notice] Local HTTP server not running; proceeding with Database Concurrency Test.');
    }
    await runStockRaceConditionTest();
  })();
}
