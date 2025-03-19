---
title: test
layout: simple
---

<script>
    import {Code} from '$lib';

    async function runCode() {
        return fetch('https://jsonplaceholder.typicode.com/todos');
    }
</script>

<!-- left -->
<div>

# Welcome to pod

pod is a novel programmable distributed ledger that prioritizes performance and efficiency by implementing a unique approach to transaction processing and consensus. Instead of enforcing strict transaction ordering like traditional blockchains, pod allows transactions to have temporal flexibility while maintaining byzantine resilience.

## What Makes pod Different?

pod achieves exceptional performance through:

- **Fast finality**: Transactions confirmed in 200ms.
- **Short-term censorship resistance**: Leaderless, blockless design that doesn't allow a transaction to be censored even for a small duration.
- **Light client support**: All receipts and logs include aggregate signature from pod's committee, allowing for trustless design and verification of pod transacitons on other chains.

## Key Features

### Fast Path Execution

pod leverages "fast path" for compatible operations that don't require strict ordering, such as payments and certain types of smart contracts. This allows for significantly faster transaction processing compared to traditional blockchain systems.

> Learn more about pod's fast path execution in our technical deep dive on [Partial Order](/architecture/fast-path) and our Execution Model documentation pages.

</div>

<!-- right -->
<div>

## Just getting started?

Check out our development quickstart guide.

## Not a developer?

Use Stripe’s no-code options or apps from our partners to get started with Stripe and to do more with your Stripe account—no code required.

<Code.Sticky>
<Code.Sample title="Code block sample" runCode={runCode} sticky>

<!-- prettier-ignore -->
```javascript
const res = await fetch(
    'https://jsonplaceholder.typicode.com/todos'
);
```

</Code.Sample>
</Code.Sticky>

</div>

---

<div>

# Setup your environment

First, set up your environment to store sensitive credentials

</div>

<div>

<Code.Sticky>

<Code.Sample title="Code block sample">

<!-- prettier-ignore -->
```javascript
export PRIVATE_KEY="your-private-key"
export RPC_URL="your-rpc-url"
```

</Code.Sample>

</Code.Sticky>

</div>

---

<div>

# Initialize your provider and credentials

First, we need to import all the necessary pod SDK libraries and Alloy types, and initialize the pod provider

`THIS IS BLOCK OF CODE`

this is line with code block inside `code block`

</div>

<div>

<Code.Sticky>

<Code.Sample title="Code block sample">

<!-- prettier-ignore -->
```rust
use eyre::Result;
use std::{env, str::FromStr};

/// Loads RPC_URL and PRIVATE_KEY from environment variables
fn load_env() -> Result<(String, String)> {
    let rpc_url = env::var("RPC_URL")
        .unwrap_or_else(|_| "http://127.0.0.1:8545".to_string());
    let private_key_hex = env::var("PRIVATE_KEY")
        .expect("Missing PRIVATE_KEY environment variable");
    
    Ok((rpc_url, private_key_hex))
}
```

</Code.Sample>

<Code.Sample title="Code block sample">

<!-- prettier-ignore -->
```rust
use eyre::Result;
use std::sync::Arc;
use alloy_signer::k256::ecdsa::SigningKey;
use pod_sdk::PrivateKeySigner;
use alloy_network::EthereumWallet;
use alloy_primitives::Address;
use alloy::transports::http::Http;
use alloy::providers::{Provider, HttpProvider};

use crate::provider;

/// Builds the Pod Provider from the given RPC URL (HTTP) and hex-encoded private key.
pub async fn build_pod_provider(
    rpc_url: &str,
    private_key_hex: &str
) -> Result<impl Provider> {
    // 1) Decode the private key into raw bytes
    let private_key_bytes = hex::decode(private_key_hex)?;
    
    // 2) Create a SigningKey
    let signing_key = SigningKey::from_slice(&private_key_bytes)?;
    
    // 3) Wrap it into a `pod_sdk::PrivateKeySigner`
    let signer = PrivateKeySigner::from_signing_key(signing_key);
    
    // 4) Construct an EthereumWallet using that signer
    let wallet = EthereumWallet::new(signer);

    // 5) Create an HTTP transport
    let transport = Http::new(rpc_url)?;

    // 6) Build the final provider. This is a Pod-aware extension of a typical `HttpProvider`.
    let pod_provider = provider::PodProviderBuilder::new()
        .with_recommended_fillers()
        .wallet(wallet)
        .on_http(transport)
        .await?;

    Ok(pod_provider)
}
```

</Code.Sample>

<Code.Sample title="table response status">

| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |

</Code.Sample>

</Code.Sticky>

</div>
