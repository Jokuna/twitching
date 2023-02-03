## Twitching Fork

Google OpenSocial platform Proxy API를 통해 720p 영상 화질 제한을 우회하는 Twitching Fork 버전입니다.

## Warning

> 본 서비스, 클라이언트, 리소스 등을 사용하여 발생하는 일에 대한 책임은 모두 사용자 본인에게 있습니다. 본 개발자는 확장 프로그램을 사용하면서 발생한 문제에 대해 책임을 지지 않습니다.

> 본 프로젝트는 POC의 일환일 뿐이며, 언제든지 막힐 수 있습니다.

## 지원대상

Chromium 기반 브라우저
- Brave
- Chrome
- Edge

## Workers Edge 설정 가이드

Workers Edge 설정하는데에는 크게 3가지 방법이 있습니다.
- twitching에서 기본으로 제공하는 Cloudflare Workers 사용하기

- [Workers Edge 직접 구축하기](https://github.com/So-chiru/twitching#%EC%A7%81%EC%A0%91-%EA%B5%AC%EC%B6%95%ED%95%98%EA%B8%B0)

- k-twitch-bypass Edge 사용하기
  - 텍스트 입력칸에 하단 값을 입력하면 됩니다.
    ```
    api.twitch.tyo.kwabang.net/proxy/https://usher.ttvnw.net/api/channel/hls
    ```
  - 해당 방법 사용 시, 다른 방법들과 다르게 일본서버 m3u8을 가져옵니다.(지역 고정)
