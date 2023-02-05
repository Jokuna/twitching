const google_opensocial_proxy = () => {
  const random_num = (digit) => `${Math.floor(Math.random() * (10**digit - 1)) + 1}`.padStart(digit, '0')
  return `https://${random_num(6)}-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=300&no_expand=1&rewriteMime=application%2Foctet-stream&url=\\0`
}

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason == 'install') {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1, 2, 3, 4, 5],
    })

    chrome.storage.local.set({ server: 'workers' })

    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1, 2, 3],
      addRules: [
        {
          id: 1,
          priority: 1,
          action: {
            type: 'redirect',
            redirect: {
              regexSubstitution: 'https://workers.twitch-relay.wesub.io/\\1',
            },
          },
          condition: {
            regexFilter: '^https://usher.ttvnw.net/api/channel/hls/(.*)',
            resourceTypes: [
              'main_frame',
              'sub_frame',
              'script',
              'object',
              'xmlhttprequest',
              'websocket',
              'webtransport',
              'webbundle',
              'other',
            ],
          },
        },
        {
          id: 2,
          priority: 1,
          action: {
            type: 'modifyHeaders',
            requestHeaders: [
              { "header": "referer", "operation": "set", "value": "https://www.twitch.tv/" },
            ],
          },
          condition: {
            regexFilter: '^https:\/\/[A-z0-9]+\-opensocial\.googleusercontent\.com',
          },
        },
        {
          id: 3,
          priority: 1,
          action: {
            type: 'redirect',
            redirect: {
              regexSubstitution: google_opensocial_proxy(),
            },
          },
          condition: {
            regexFilter: '^https:\/\/video-edge-[A-z0-9]+\.[A-z0-9]+\.abs\.hls\.ttvnw\.net/(.*)',
            requestMethods: [
              'get',
              'post'
            ],
          },
        },
      ],
    })
  }
})
