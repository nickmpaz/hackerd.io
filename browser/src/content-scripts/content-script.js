import variables from '../variables.js'
import api from '../api.js'
import Fuse from "fuse.js";

function getApiToken() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(["apiToken"], function (result) {
            resolve(result.apiToken)
        });
    })
}

function getResourceCache() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(["resourceCache"], function (result) {
            resolve(result.resourceCache)
        });
    })
}

function getResourceCacheTime() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(["resourceCacheTime"], function (result) {
            resolve(result.resourceCacheTime)
        });
    })
}

async function verifyResourceCache(cacheTTL) {
    var resourceCacheTime = await getResourceCacheTime()
    var date = new Date()
    var now = date.getTime() / 1000
    if (!resourceCacheTime || now - resourceCacheTime > cacheTTL) {
        console.log('resource cache not valid, setting...')
        var apiToken = await getApiToken()
        var resources = await api.getResources(apiToken)
        chrome.storage.sync.set({ resourceCache: resources });
        chrome.storage.sync.set({ resourceCacheTime: now });
    }
}

function injectHTML(resources, afterId) {
    var cards = ''
    for (let i = 0; i < resources.length; i++) {
        let title = resources[i].title || "Untitled"
        let href = resources[i].type === 'link' ? resources[i].content : `${variables.webAppUrl}${resources[i].resource_id}`
        cards += `
            <div class="stashable-card">
                <a class="stashable-title" href="${href}">
                    ${ title}
                </a>
            </div>
        `
    }
    var html = `
        <div class="stashable-container">
            ${cards}
        </div>
    `
    var element = document.getElementById(afterId);
    element.insertAdjacentHTML('afterend', html)
}

function fuzzySearch(resources, query) {
    const options = {
        threshold: 0.25,
        keys: ["title", "tags"],
    };
    const fuse = new Fuse(resources, options);
    const result = fuse.search(query)
    const finalResult = result.map((a) => a.item);
    return finalResult
}

async function main() {

    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var query = urlParams.get('q')
    var resources = await getResourceCache()
    if (!resources) {
        let apiToken = await getApiToken()
        resources = await api.getResources(apiToken)
    }
    var filteredResources = fuzzySearch(resources, query)
    injectHTML(filteredResources, "before-appbar")
    verifyResourceCache(variables.cacheTTL)
}

main()