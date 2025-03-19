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

<div>

## eth_blockNumber

Returns the latest past perfection pod timestamp in microseconds.

### Response

| Key              | Type    | Description             |
| ---------------- | ------- | ----------------------- |
| `statusCode`       | integer | HTTP status code        |
| `response.jsonrpc` | string  | same value as request   |
| `response.id`      | integer | unique value as request |
| `response.result`  | string  | latest block number     |

</div>

<div>

<Code.Sticky>

<Code.Sample title="POST: https://rpc.dev.pod.network/" runCode={play}>

```bash
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

</Code.Sample>

<Code.Sample title="Body">

| Key     | Type     | Required | Default           |
| ------- | -------- | -------- | ----------------- |
| jsonrpc | string   | required | "2.0"             |
| method  | string   | required | "eth_blockNumber" |
| params  | string[] | required | []                |
| id      | integer  | required | 1                 |

</Code.Sample>

</Code.Sticky>

</div>
