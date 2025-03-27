---
layout: simple  
---

<script>
    import {Code} from '$lib';
</script>

[content]

# RPC API

This documentation provides detailed information about the JSON-RPC methods supported by pod.

## Overview

Pod implements a JSON-RPC API that allows interaction with the network. While many methods align with the Ethereum JSON-RPC specification (methods prefixed with "eth*"), pod includes additional metadata ("pod_metadata" attribute) and pod-specific functionality (methods prefixed with "pod*").

[/content]

[content]

[/content]

---

[content]

## Base URL

The API endpoint is accessible at `https://rpc.dev.pod.network`.

## Common Response Fields

All successful responses include:

| Field          | Description                                                     |
| -------------- | --------------------------------------------------------------- |
| `jsonrpc`      | Always "2.0"                                                    |
| `id`           | The request ID                                                  |
| `result`       | The method-specific response data                               |
| `pod_metadata` | Additional POD-specific information (location varies by method) |

## Error Handling

Error responses follow the JSON-RPC 2.0 specification.

## Error Codes

| Code    |                        |
| ------- | ---------------------- |
| `32700` | Parse error            |
| `32600` | Invalid Request        |
| `32601` | Method not found       |
| `32602` | Invalid params         |
| `32603` | Internal error         |
| `32000` | Server error (various) |

[/content]

[content]

[sticky]

[codeblock] title="API endpoint"

```bash
https://rpc.dev.pod.network
```

[/codeblock]

Parameters must match the JSON-RPC 2.0 specification.

[codeblock] title="Parameters"

```json
{
	"jsonrpc": "2.0",
	"method": "method_name",
	"params": [],
	"id": 1
}
```

[/codeblock]

[codeblock] title="Error Response"

```json
{
	"jsonrpc": "2.0",
	"error": {
		"code": -32000,
		"message": "Error message"
	},
	"id": 1
}
```

[/codeblock]

[/sticky]

[/content]
