<script>
	import { GlobalCSS } from 'figma-plugin-ds-svelte';
	import { Type, Button, Input, Label, SelectMenu } from 'figma-plugin-ds-svelte';

	let pattern = ""

	function destroyComps() {
		parent.postMessage({
			pluginMessage: {
				'type': 'destroy-components',
				'pattern': pattern
			}
		}, '*');
	}
	function unstyleEls() {
		parent.postMessage({
			pluginMessage: {
				'type': 'unstyle-elements',
			}
		}, '*');
	}

	function cancel() {
		parent.postMessage({ pluginMessage: { 'type': 'cancel' } }, '*')
	}

</script>

<style>
	.flex-gap {
		gap: 8px
	}
</style>

<div class="wrapper p-xsmall">

	<div class="mb-xsmall flex-grow">
		<Type size="xsmall" weight="bold">Destroy in selection</Type>
	</div>

	<div class="flex mb-xsmall flex-grow flex-gap">
		<Button on:click={destroyComps} class="justify-content-center flex-grow">Detach Instances</Button>
		<Button on:click={unstyleEls} class="justify-content-center flex-grow">Unstyle Layers</Button>
	</div>
</div>