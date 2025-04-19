---
title: test code block md
layout: single
---

<script>
    import { jsSample, pySample, rustSample } from './code-sample';

	const run = async () => {
		return fetch('https://baconipsum.com/api/?type=meat-and-filler');
	};
</script>

<!-- <Code.Provider title="Create by svelte html code" runCode={run}>

<Code.Code code={`console.log("test")`} lang="js" alias="javascript" />

<Code.Code code={`console.log("test 2")`} lang="js" alias="javascript 2" />

<Code.Sample></Code.Sample> </Code.Provider> -->


+++ codeblock title="Create by markdown" runCode={run}

```js alias="javascript"
console.log("test");
```

```js alias="javascript 2"
console.log("test 2");
```

+++ endcodeblock

