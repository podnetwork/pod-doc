<script context="module">
	export const metadata = {"title":"Welcome to pod","layout":"single","url":"/","toc":{"welcome-to-pod":"Welcome to pod","what-makes-pod-different":"What Makes pod Different?","key-features":"Key Features"}};
	const { title, layout, url, toc } = metadata;
</script>
<script lang="ts">
import {Code} from "$lib";
</script>


<Code.Provider >
<Code.Code code={'#![allow(unused)]\nfn main() {\n    println!("Hello, world!");\n}\n'} lang="rust" alias="rust"></Code.Code>
<Code.Sample></Code.Sample> </Code.Provider>
