---
layout: simple  
---

<script>
    import {Code} from '$lib';
</script>

[content]

## Common Response Fields

All successful responses include:

| Field          | Description                                                     |
| -------------- | --------------------------------------------------------------- |
| `jsonrpc`      | Always "2.0"                                                    |
| `id`           | The request ID                                                  |
| `result`       | The method-specific response data                               |
| `pod_metadata` | Additional POD-specific information (location varies by method) |

[/content]

[content]

[sticky]

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

[/sticky]

[/content]