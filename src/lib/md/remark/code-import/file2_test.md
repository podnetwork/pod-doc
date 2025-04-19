<script context="module">
	export const metadata = {"title":"test code block md","layout":"simple"};
	const { title, layout } = metadata;
</script>
<script>
    import {Code} from '$lib';
    import { jsSample, pySample, rustSample } from './code-sample';

	const run = async () => {
		return fetch('https://baconipsum.com/api/?type=meat-and-filler');
	};
</script>


<div>
<p>[codeblock] title=“Create by markdown” runCode={run}</p>
<pre class="language-js">{@html `<code class="language-js"><span class="token function">fetch</span><span class="token punctuation">(</span><span class="token string">'https://baconipsum.com/api/?type=meat-and-filler'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code>`}</pre>
<pre class="language-py">{@html `<code class="language-py"><span class="token keyword">import</span> requests

response <span class="token operator">=</span> requests<span class="token punctuation">.</span>get<span class="token punctuation">(</span><span class="token string">'https://baconipsum.com/api/?type=meat-and-filler'</span><span class="token punctuation">)</span></code>`}</pre>
<pre class="language-rust">{@html `<code class="language-rust"><span class="token keyword">use</span> <span class="token namespace">reqwest<span class="token punctuation">::</span></span><span class="token class-name">Error</span><span class="token punctuation">;</span>

<span class="token keyword">async</span> <span class="token keyword">fn</span> <span class="token function-definition function">fetch_bacon</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">-></span> <span class="token class-name">Result</span><span class="token operator">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Error</span><span class="token operator">></span> <span class="token punctuation">&#123;</span>
    <span class="token keyword">let</span> response <span class="token operator">=</span> <span class="token namespace">reqwest<span class="token punctuation">::</span></span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">"https://baconipsum.com/api/?type=meat-and-filler"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token keyword">await</span><span class="token operator">?</span><span class="token punctuation">;</span>
    response<span class="token punctuation">.</span><span class="token function">text</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token keyword">await</span>
<span class="token punctuation">&#125;</span></code>`}</pre>
<p>[/codeblock]</p>
<div class='h-10'></div>
<p>[codeblock] title=“Block of code without play action”</p>
<pre class="language-js">{@html `<code class="language-js"><span class="token function">fetch</span><span class="token punctuation">(</span><span class="token string">'https://baconipsum.com/api/?type=meat-and-filler'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code>`}</pre>
<p>[/codeblock]</p>
</div>
<div>
<Code.Sample
title="Create by svelte html code"
codeblocks={[ { lang: 'js', alias: 'javascript', code: jsSample }, { lang: 'py', code: pySample }, { lang: 'rust', code: rustSample } ]}
runCode={run}
></Code.Sample>
</div>
