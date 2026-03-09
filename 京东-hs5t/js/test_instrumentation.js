// Test script for ParamsSign instrumentation
// Simulate browser environment for Node.js
global.window = {
    vm_trace_enabled: true,
    vm_trace: [],
    document: {
        createElement: () => ({}),
        getElementsByTagName: () => [{}],
        cookie: '',
        querySelector: () => null
    },
    localStorage: {
        getItem: () => null,
        setItem: () => {}
    },
    __JDWEBSIGNHELPER_$DATA__: {}
};

const ParamsSign = require('./hs5t.js');

// Create a ParamsSign instance
const signer = new ParamsSign();

// Test data
const testData = {
    appid: 'test_app',
    body: 'test_body',
    clientVersion: '1.0.0',
    client: 'test_client'
};

// Sign the data
try {
    const result = signer.signSync(testData);
    console.log('Signing result:', result);
    console.log('VM trace length:', window.vm_trace.length);
    console.log('First 10 trace entries:');
    window.vm_trace.slice(0, 10).forEach((entry, i) => {
        console.log(`${i}: opcode=${entry.opcode}, stack_length=${entry.stack_length}, pc=${entry.pc}`);
    });
} catch (error) {
    console.error('Error:', error);
}