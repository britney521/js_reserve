// ==UserScript==
// @name        Hook worker
// @namespace   http://tampermonkey.net/
// @version     0.1
// @description try to take over the world!
// @author      You
// @include     *
// @grant       none
// @run-at      document-start
// ==/UserScript==

(function() {
    const OriginalBlob = window.Blob;

    window.Blob = function(...args) {
        args[0]= [";eval=()=>{};"+args[0][0]]
        const parts = args[0];
        const options = args[1];

        if (Array.isArray(parts) && options && options.type === 'application/javascript') {
            try {
                const workerCodeContent = parts.map(part => {
                    if (typeof part === 'string') {
                        return part;
                    } else if (part instanceof ArrayBuffer) {
                        return new TextDecoder().decode(part);
                    } else if (part instanceof Blob) {
                        console.warn("Hooked Blob received a Blob part. Cannot synchronously read its content.");
                        return "[Blob part - content not synchronously available]";
                    } else {
                        return String(part); // 尝试转换为字符串
                    }
                }).join('');


                return new OriginalBlob(args[0], args[1]);

            } catch (e) {
                console.error('Error in hooked Blob logic:', e);
                return new OriginalBlob(args[0], args[1]);
            }
        } else {
            return new OriginalBlob(...args);
        }
    };
    const OriginalWorker = window.Worker;

    window.Worker = function(workerUrl, options) {
        if (typeof workerUrl === 'string' && workerUrl.startsWith('blob:')) {
            fetch(workerUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(blobContent => {
                    console.log('Blob Worker Content (first 500 chars):', blobContent.substring(0, 500) + (blobContent.length > 500 ? '...' : ''));
                    console.log('Full Blob Worker Content (if needed):', blobContent); // 谨慎打印完整内容
                })
                .catch(error => {
                    console.error('Failed to fetch Blob Worker content:', error);
                });
        }
        return new OriginalWorker(workerUrl, options);
    };
})();
