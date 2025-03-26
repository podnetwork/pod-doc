---
title: test code block md
layout: simple
---

<script>
    import {Code} from '$lib';
    import { jsSample, pySample, rustSample } from './code-sample';

	const run = async () => {
		return fetch('https://baconipsum.com/api/?type=meat-and-filler');
	};
</script>

<div>

[codeblock] title="Create by markdown" runCode={run}

```js alias="javascript code here"
fetch('https://baconipsum.com/api/?type=meat-and-filler');
```

```py alias="python code here"
import requests

response = requests.get('https://baconipsum.com/api/?type=meat-and-filler')
```

```rust alias="rust code here"
use reqwest::Error;

async fn fetch_bacon() -> Result<String, Error> {
    let response = reqwest::get("https://baconipsum.com/api/?type=meat-and-filler").await?;
    response.text().await
}
```

[/codeblock]

<div class='h-10'></div>

[codeblock] title="Block of code without play action"

```js alias="javascript"
fetch('https://baconipsum.com/api/?type=meat-and-filler');
```

[/codeblock]

</div>

<div>

<Code.Sample
title="Create by svelte html code"
codeblocks={[ { lang: 'js', alias: 'javascript', code: jsSample }, { lang: 'py', code: pySample }, { lang: 'rust', code: rustSample } ]}
runCode={run}
></Code.Sample>

</div>
