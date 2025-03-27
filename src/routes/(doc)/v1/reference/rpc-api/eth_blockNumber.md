---
layout: simple
---

<script>
    import {Code} from '$lib';

    async function play() {
        return fetch('https://rpc.dev.pod.network/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_blockNumber',
                params: [],
                id: 1
            })
        })
    }
</script>

[content]

## eth_blockNumber

Returns the latest past perfection pod timestamp in microseconds.

### Response

| Key                | Type    | Description             |
| ------------------ | ------- | ----------------------- |
| `statusCode`       | integer | HTTP status code        |
| `response.jsonrpc` | string  | same value as request   |
| `response.id`      | integer | unique value as request |
| `response.result`  | string  | latest block number     |

[/content]

[content]

[sticky]

[codeblock] title="POST rpc.dev.pod.network" runCode={play}

```bash alias="curl"
curl -L \
  --request POST \
  --url 'https://rpc.dev.pod.network/' \
  --header 'Content-Type: application/json' \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_blockNumber",
    "params": [],
    "id": 1
  }'
```

```js alias="javascript"
await fetch('https://rpc.dev.pod.network/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_blockNumber',
    params: [],
    id: 1
  })
});
```

[/codeblock]

[/sticky]

[/content]
