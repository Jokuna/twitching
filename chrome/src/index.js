const servers = [
  {
    id: 'twitch',
    value: 'Twitch가 선택하는 서버',
    server: undefined,
  },
  {
    id: 'workers',
    value: 'Cloudflare Workers',
    server: 'workers.twitch-relay.wesub.io',
  },
  {
    id: 'custom',
    value: '커스텀',
    server: undefined,
  },
]

const google_opensocial_proxy = () => {
  const random_num = (digit) => `${Math.floor(Math.random() * (10**digit - 1)) + 1}`.padStart(digit, '0')
  return `https://${random_num(6)}-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=300&no_expand=1&rewriteMime=application%2Foctet-stream&url=\\0`
}

const GSEupdate = () => {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [3],
  });

  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [
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
  });
}

const store = {
  get: async key => {
    return new Promise(resolve => {
      chrome.storage.local.get(key, result => {
        resolve(typeof key === 'undefined' ? result : result[key])
      })
    })
  },

  set: async (key, value) =>
    new Promise(async resolve => {
      const data = await store.get()

      chrome.storage.local.set({ ...data, [key]: value }, resolve)
    }),
}

const updateRule = server => {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1, 3],
  })

  if (!server) return

  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [
      {
        id: 1,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            regexSubstitution: 'https://' + server + '/\\1',
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
    ],
  })
  GSEupdate()
}

const renderInputs = async () => {
  const list = document.querySelector('#list')

  const serverInStorage = await store.get('server')

  servers.forEach(async ({ id, value, server }) => {
    const element = document.createElement('div')
    element.className = 'radio-option'

    const radioInput = document.createElement('input')
    radioInput.type = 'radio'
    radioInput.name = 'server'
    radioInput.id = id
    radioInput.value = id
    radioInput.checked = serverInStorage === id

    radioInput.onchange = async () => {
      await store.set('server', radioInput.value)

      if (radioInput.value === 'custom') {
        updateRule(document.querySelector('#custom-input').value)
      } else {
        updateRule(server)
      }
    }

    if (id === 'custom') {
      const customInput = document.createElement('input')
      customInput.type = 'text'
      customInput.id = 'custom-input'
      customInput.placeholder = 'your-worker.workers.dev'
      customInput.value = (await store.get('custom')) || ''

      const update = async () => {
        document.querySelector('#custom').checked = true

        await store.set('custom', customInput.value)
        await store.set('server', 'custom')
        updateRule(customInput.value)
      }

      customInput.onchange = update

      element.appendChild(customInput)
    } else {
      const radioLabel = document.createElement('label')
      radioLabel.htmlFor = id
      radioLabel.textContent = value

      element.appendChild(radioLabel)
    }

    element.appendChild(radioInput)
    list.appendChild(element)
  })
  document.getElementById('google').addEventListener("click", GSEupdate)
}

window.addEventListener('DOMContentLoaded', () => {
  renderInputs()
})
