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

Pod implements a JSON-RPC API that allows interaction with the network. While many methods align with the Ethereum JSON-RPC specification (methods prefixed with "eth_"), pod includes additional metadata ("pod_metadata" attribute) and pod-specific functionality (methods prefixed with "pod_").

[/content]

[content]

[/content]

---

[content]

## Base URL

The API endpoint is accessible at `https://rpc.dev.pod.network`.

[/content]

[content]

[sticky]

[codeblock] title="API endpoint"

```bash
https://rpc.dev.pod.network
```

[/codeblock]

[/sticky]

[/content]
